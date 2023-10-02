# _*_ coding:utf-8 _*_
import random
from datetime import datetime, timedelta
from faker import Faker

faker = Faker(locale='zh_CN')

# 地址
print(faker.longitude())  # 经度
print(faker.latitude())  # 维度
print(faker.address())  # 地址
print(faker.color_name())  # 颜色
print(faker.safe_hex_color())  # 16进制颜色
print(faker.date_time())  # 随机时间
print(faker.ipv4())  # ipv4
print(faker.ipv6())  # ipv6
print(faker.phone_number())  # 号码
print(faker.profile())  # 人物简介
print(faker.user_agent())  # UA
print(faker.company())  # 公司
print(faker.credit_card_number())  # 信用卡
