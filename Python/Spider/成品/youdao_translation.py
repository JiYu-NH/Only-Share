import time
import hashlib
import requests


def translate(_text):
    """
    :param _text:需要翻译的内容
    :return: 翻译好的内容
    """
    _now_t = int(time.time() * 10000)
    _sign = hashlib.md5(f'fanyideskweb{_text}{_now_t}Ygy_4c=r#e#4EX^NUGUc5'.encode()).hexdigest()

    cookies = {
        'OUTFOX_SEARCH_USER_ID': '-206486996@10.108.162.135',
        'JSESSIONID': 'aaaWI2J-PCRhd-x7w-0by',
        'OUTFOX_SEARCH_USER_ID_NCOO': '1956807137.8124597',
        '___rl__test__cookies': '1651230232224',
    }

    headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://fanyi.youdao.com',
        'Referer': 'https://fanyi.youdao.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
    }

    params = (('smartresult', ['dict', 'rule']),)

    data = {
        'i': _text,
        'from': 'AUTO',
        'to': 'AUTO',
        'smartresult': 'dict',
        'client': 'fanyideskweb',
        'salt': str(_now_t),
        'sign': _sign,
        'lts': int(_now_t / 10),
        'bv': 'ac3968199d18b7367b2479d1f4938ac2',
        'doctype': 'json',
        'version': '2.1',
        'keyfrom': 'fanyi.web',
        'action': 'FY_BY_REALTlME'
    }

    response = requests.post('https://fanyi.youdao.com/translate_o', headers=headers, params=params, cookies=cookies,
                             data=data)
    if response.status_code == 200:
        res = response.json()

        # 查看返回的源数据
        print('原始JSON', res)
        print(res['translateResult'][0])

        # 将长句子翻译合在一起
        src = ''
        tgt = ''
        for i in res['translateResult'][0]:
            src = src + i['src']
            tgt = tgt + i['tgt']

        return {'src': src, 'tgt': tgt}

    else:
        print('Translate Error . Response status code : ', response.status_code)
        return False


if __name__ == '__main__':
    print(translate('有道翻译的接口'))
