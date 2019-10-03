from backend.settings import SECRET_KEY
from coffeeBot.models import User


class CoffeeBotBackendMixin:
    def authenticate(self, telegram_id):
        if telegram_id:
            token = telegram_id.decode('utf-8') if isinstance(telegram_id, bytes) else telegram_id
            user = self.get_user(telegram_id=telegram_id)
            if user.is_active:
                return user

    def get_user(self, telegram_id):
        try:
            return User.objects.get(telegram_id=telegram_id)
        except User.DoesNotExist:
            return None
