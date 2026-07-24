import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class PaystackClient:
    BASE_URL = 'https://api.paystack.co'

    def __init__(self):
        self.secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', '')
        self.headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json',
        }

    @property
    def is_configured(self):
        return bool(self.secret_key)

    def initialize_transaction(self, email, amount, reference, callback_url=None):
        if not self.is_configured:
            return None
        data = {
            'email': email,
            'amount': int(amount * 100),
            'reference': reference,
        }
        if callback_url:
            data['callback_url'] = callback_url
        try:
            resp = requests.post(f'{self.BASE_URL}/transaction/initialize/', json=data, headers=self.headers, timeout=15)
            resp.raise_for_status()
            result = resp.json()
            if result['status']:
                return {
                    'authorization_url': result['data']['authorization_url'],
                    'access_code': result['data'].get('access_code', ''),
                    'reference': result['data']['reference'],
                }
            logger.error('Paystack init failed: %s', result.get('message'))
        except requests.RequestException as e:
            logger.error('Paystack init error: %s', str(e))
        return None

    def verify_transaction(self, reference):
        if not self.is_configured:
            return None
        try:
            resp = requests.get(f'{self.BASE_URL}/transaction/verify/{reference}/', headers=self.headers, timeout=15)
            resp.raise_for_status()
            result = resp.json()
            if result['status']:
                status_map = {'success': 'successful', 'failed': 'failed', 'abandoned': 'failed'}
                return {
                    'status': status_map.get(result['data']['status'], 'pending'),
                    'amount': result['data']['amount'] / 100,
                    'currency': result['data']['currency'],
                    'provider_reference': result['data'].get('id', ''),
                    'paid_at': result['data'].get('paid_at', ''),
                }
            logger.error('Paystack verify failed: %s', result.get('message'))
        except requests.RequestException as e:
            logger.error('Paystack verify error: %s', str(e))
        return None

    def refund_transaction(self, reference):
        if not self.is_configured:
            return None
        try:
            resp = requests.post(f'{self.BASE_URL}/refund/', json={'transaction_reference': reference}, headers=self.headers, timeout=15)
            resp.raise_for_status()
            result = resp.json()
            return result['status']
        except requests.RequestException as e:
            logger.error('Paystack refund error: %s', str(e))
        return None

    def verify_webhook(self, signature, payload):
        import hashlib, hmac
        expected = hmac.new(self.secret_key.encode(), payload, hashlib.sha512).hexdigest()
        return hmac.compare_digest(expected, signature)


class FlutterwaveClient:
    BASE_URL = 'https://api.flutterwave.com/v3'

    def __init__(self):
        self.secret_key = getattr(settings, 'FLUTTERWAVE_SECRET_KEY', '')
        self.headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json',
        }

    @property
    def is_configured(self):
        return bool(self.secret_key)

    def initialize_transaction(self, email, amount, reference, callback_url=None):
        if not self.is_configured:
            return None
        data = {
            'tx_ref': reference,
            'amount': amount,
            'currency': getattr(settings, 'DEFAULT_CURRENCY', 'USD'),
            'redirect_url': callback_url or '',
            'customer': {'email': email},
        }
        try:
            resp = requests.post(f'{self.BASE_URL}/payments', json=data, headers=self.headers, timeout=15)
            resp.raise_for_status()
            result = resp.json()
            if result['status'] == 'success':
                return {
                    'authorization_url': result['data']['link'],
                    'reference': reference,
                }
            logger.error('Flutterwave init failed: %s', result.get('message'))
        except requests.RequestException as e:
            logger.error('Flutterwave init error: %s', str(e))
        return None

    def verify_transaction(self, transaction_id):
        if not self.is_configured:
            return None
        try:
            resp = requests.get(f'{self.BASE_URL}/transactions/{transaction_id}/verify/', headers=self.headers, timeout=15)
            resp.raise_for_status()
            result = resp.json()
            if result['status'] == 'success':
                status_map = {'successful': 'successful', 'failed': 'failed', 'cancelled': 'failed'}
                return {
                    'status': status_map.get(result['data']['status'], 'pending'),
                    'amount': result['data']['amount'],
                    'currency': result['data']['currency'],
                    'provider_reference': str(result['data']['id']),
                    'paid_at': result['data'].get('paid_at', ''),
                }
            logger.error('Flutterwave verify failed: %s', result.get('message'))
        except requests.RequestException as e:
            logger.error('Flutterwave verify error: %s', str(e))
        return None

    def refund_transaction(self, transaction_id):
        if not self.is_configured:
            return None
        try:
            resp = requests.post(f'{self.BASE_URL}/transactions/{transaction_id}/refund/', headers=self.headers, timeout=15)
            resp.raise_for_status()
            return True
        except requests.RequestException as e:
            logger.error('Flutterwave refund error: %s', str(e))
        return None


def get_payment_client(provider):
    clients = {
        'paystack': PaystackClient,
        'flutterwave': FlutterwaveClient,
    }
    client_class = clients.get(provider)
    if client_class:
        return client_class()
    return None
