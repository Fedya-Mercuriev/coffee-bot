from django.contrib import admin

from coffeeBot.models import Good, Volume, GoodVolume, User


# Register your models here.
admin.site.register(Good)
admin.site.register(Volume)
admin.site.register(GoodVolume)
admin.site.register(User)
