from django.db import transaction
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action

from coffeeBot.models import Good, GoodType, GoodVolume, Order, Cart, OrderCart, Volume
from coffeeBot.serializers import (
    GoodVolumeSerializer, GoodTypeSerializer, OrderSerializer, CartSerializer, GoodSerializer,
    VolumeSerializer)


class VolumeView(viewsets.ModelViewSet):
    """
    VOLUMES
    """
    queryset = Volume.objects.all()
    serializer_class = VolumeSerializer


class GoodView(viewsets.ModelViewSet):
    '''
    GOODS
    '''
    queryset = Good.objects.all()
    serializer_class = GoodSerializer

    def retrieve(self, request, *args, **kwargs):
        good = self.get_object()
        serializer = GoodVolumeSerializer(good.volumes.all(), context={'request': request}, many=True)
        return Response(serializer.data)


class GoodVolumeView(viewsets.ModelViewSet):
    '''
    GOOD VOLLUMES
    '''
    queryset = GoodVolume.objects.all()
    serializer_class = GoodVolumeSerializer


class GoodTypeView(viewsets.ModelViewSet):
    '''
    GOODTYPES
    '''
    queryset = GoodType.objects.all()
    serializer_class = GoodTypeSerializer

    def retrieve(self, request, *args, **kwargs):
        goodtype = self.get_object()
        serializer = GoodSerializer(goodtype.goods.all(), many=True, context={'request': request})
        return Response(serializer.data)


class OrderView(viewsets.ModelViewSet):
    '''
    ORDER
    '''
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    # def list(self, request, *args, **kwargs):
    #     if not request.user.is_admin:
    #         self.queryset = self.queryset.filter(user_id=request.user.user_id)

    # def retrieve(self, request, *args, **kwargs):
    #     print(args)
    #     print(kwargs)

    @action(methods=['GET'], detail=True, url_path='delete')
    def delete(self, request, *args, **kwargs):
        return Response({'message': 'lkdfsldjfhlskdjflskdf'})


class CartView(viewsets.ModelViewSet):
    '''
    CUSTOM VIEWSET
    '''
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    @transaction.atomic()
    def create(self, request, *args, **kwargs):
        data = request.data
        user_id = request.user.user_id
        goodtype_id = data['good']
        quantity = data['quantity']

        order, created = Order.objects.get_or_create(
            user_id=user_id,
            order_state_id=1)

        cart = Cart.objects.create(
            good_id=goodtype_id,
            quantity=quantity)

        order_cart_link = OrderCart(cart=cart, order=order)
        order_cart_link.save()

        return Response({
            'message': 'Cart added successfully.',
            'url': request.META,
        })

    # def list(self, request, *args, **kwargs):
    #     pass
