from django.conf.urls import url
from django.urls import path
from rest_framework import routers

from coffeeBot import views


router = routers.DefaultRouter()
router.register(r'goods', views.GoodView)
router.register(r'volumes', views.VolumeView)
router.register(r'good_volumes', views.GoodVolumeView)
router.register(r'good_types', views.GoodTypeView)
router.register(r'orders', views.OrderView)
router.register(r'carts', views.CartView)
