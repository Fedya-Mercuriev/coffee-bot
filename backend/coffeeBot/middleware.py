from coffeeBot.backends import CoffeeBotBackendMixin
import json


class GetCredentialsMiddleware(CoffeeBotBackendMixin):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        telegram_id = None
        if request.method == 'POST':
            try:
                data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError:
                data = {}
            telegram_id = data.get('telegram_id')
        elif request.method in ('GET', 'DELETE'):
            telegram_id = request.GET.get('telegram_id')

        if not telegram_id:
            telegram_id = 'admin'

        user = self.authenticate(telegram_id)
        if user:
            request.user = user
            request.user_id = user.user_id
        return self.get_response(request)
