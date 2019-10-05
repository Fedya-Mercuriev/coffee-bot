from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser
from django.utils.functional import cached_property
from rest_framework.exceptions import NotAuthenticated


class Usertype(models.Model):
    usertype_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)
    description = models.TextField(max_length=255, blank=True, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'usertypes'

    def __str__(self):
        return self.name


class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    telegram_id = models.CharField(max_length=255, null=False, blank=False, unique=True)
    usertype = models.ForeignKey(Usertype, db_column='usertype', related_name='users', on_delete=models.CASCADE)
    name = models.CharField(max_length=20, null=True)
    surname = models.CharField(max_length=45, null=True)
    phone_number = models.CharField(max_length=20, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    counter = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    USERNAME_FIELD = 'telegram_id'

    class Meta:
        db_table = 'users'

    @cached_property
    def is_admin(self):
        if self.usertype == Usertype.objects.get(usertype_id=1):
            return True
        else:
            raise NotAuthenticated()

    @cached_property
    def is_active(self):
        if self.active:
            return True
        else:
            raise NotAuthenticated()

    def has_perms(self, perm, obj=None):
        '''
        Does the user have a specific permission?
        '''
        return True

    def has_perm(self, *args, **kwargs):
        return self.is_admin

    def is_staff(self):
        return self.is_admin

    def get_username(self):
        return '{} {}'.format(self.name, self.surname)

    def has_module_perms(self, *args, **kwargs):
        if self.is_admin and self.is_active:
            return True


class GoodType(models.Model):
    goodtype_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)
    description = models.CharField(max_length=255)

    class Meta:
        db_table = 'good_types'

    def __str__(self):
        return self.name


class Good(models.Model):
    good_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)
    description = models.CharField(max_length=255)
    goodtype = models.ForeignKey(GoodType, db_column='goodtype', related_name='goods', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'goods'

    def __str__(self):
        return self.name


class Volume(models.Model):
    volume_id = models.AutoField(primary_key=True)
    volume = models.CharField(max_length=8)
    unit_of_measure = models.CharField(max_length=8)

    class Meta:
        db_table = 'volumes'

    def __str__(self):
        return '{} {}'.format(self.volume, self.unit_of_measure)


class GoodVolume(models.Model):
    goodvolume_id = models.AutoField(primary_key=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    good = models.ForeignKey(Good, db_column='good', related_name='volumes', on_delete=models.CASCADE)
    volume = models.ForeignKey(Volume, db_column='volume', related_name='goods', on_delete=models.CASCADE)

    class Meta:
        db_table = 'good_volume_links'
        unique_together = (('good', 'volume'),)

    def __str__(self):
        return '{}, {} {}'.format(self.good.name, self.volume.volume, self.volume.unit_of_measure)


class Cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    good = models.ForeignKey(GoodVolume, db_column='good', related_name='good_cards', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1, null=False)

    class Meta:
        db_table = 'carts'


class OrderState(models.Model):
    order_status_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45, blank=False, null=False)
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'order_states'


class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, db_column='user', related_name='orders', on_delete=models.CASCADE)
    register_time = models.DateTimeField(auto_now_add=True)
    comment = models.CharField(max_length=255, null=True, blank=True)
    order_state = models.ForeignKey(
        OrderState, db_column='state', related_name='state_orders', on_delete=models.CASCADE, default=1)

    class Meta:
        db_table = 'orders'


class OrderCart(models.Model):
    order_cart_link_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, db_column='order', related_name='carts', on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, db_column='cart', related_name='order', on_delete=models.CASCADE)
    cart_price = models.IntegerField(default=0)

    class Meta:
        db_table = 'order_cart_links'
        unique_together = (('order', 'cart'), )

    def __str__(self):
        return 'order_cart_link_id: {} |\torder_id: {}, cart_id: {}'.format(
            self.order_cart_link_id, self.order_id, self.cart_id)

    def save(self, *args, **kwargs):
        self.cart_price = int(self.cart.good.price) * self.cart.quantity
        super().save(*args, **kwargs)
