from rest_framework import serializers
from coffeeBot.models import Good, GoodType, Volume, Cart, Order, OrderCart, OrderState, GoodVolume


class VolumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volume
        fields = ['volume_id', 'volume', 'unit_of_measure']


class GoodVolumeSerializer(serializers.ModelSerializer):

    volume = serializers.ReadOnlyField(source='volume.volume')
    units = serializers.ReadOnlyField(source='volume.unit_of_measure')

    class Meta:
        model = GoodVolume
        fields = ['url', 'price', 'goodvolume_id', 'good', 'volume', 'units']


class GoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Good
        fields = ['url', 'good_id', 'name', 'description', 'goodtype']


class GoodTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoodType
        fields = ['url', 'name', 'description']


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['url', 'cart_id', 'good', 'quantity']


class CartListSerializer(serializers.ModelSerializer):
    good_name = serializers.ReadOnlyField(source='cart.good.good.name')
    good_volume_id = serializers.ReadOnlyField(source='cart.good_id')
    quantity = serializers.ReadOnlyField(source='cart.quantity')

    class Meta:
        model = OrderCart
        fields = ['cart_id', 'good_name', 'quantity', 'good_volume_id', 'cart_price']


class OrderSerializer(serializers.HyperlinkedModelSerializer):

    carts = CartListSerializer(many=True, read_only=True)
    status = serializers.ReadOnlyField(source='order_state.name')

    class Meta:
        model = Order
        fields = ['url', 'order_id', 'user_id', 'status', 'comment', 'register_time', 'carts']
