const NodeRSA = require('node-rsa');
var key = new NodeRSA({
	b: 512
});


// key.generateKeyPair();
// console.log(key.exportKey('pkcs8-public'));
// console.log(key.exportKey('pkcs8-private'));

var publicKey =
	`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqwEDC2qq+Dg4nwGA+svd
Nr/Dg4Op1vXeD5H00/4J2KxBplfhc9cexGoisRVcH/GyhjPQtynn79ybWfCo5DxR
SiSIoqeB4//JG5c8zsuTaqaKbcyfQjlRelYABRGyqm8cRApg4ZVx6Or7+1AsIMLK
DzykHGCPxww/P00S9NhuKOEak8KXvjtNPUCq+5OMPHBVlYJgMrrfRlRTf87COdA3
Th743Ov2z5kh+V1wPiWU6htXXLA1biXWY0mveXFZIxrz3T2ji6LuZMg0rv9bOhSF
yQFqrP1THLAG2khcLK78muMMFkFMMHBv1Odms1XXpgOn9eMClMRqMCgwfGQ6mlL5
CwIDAQAB
-----END PUBLIC KEY-----`;


var privateKey =
	`-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCrAQMLaqr4ODif
AYD6y902v8ODg6nW9d4PkfTT/gnYrEGmV+Fz1x7EaiKxFVwf8bKGM9C3Kefv3JtZ
8KjkPFFKJIiip4Hj/8kblzzOy5NqpoptzJ9COVF6VgAFEbKqbxxECmDhlXHo6vv7
UCwgwsoPPKQcYI/HDD8/TRL02G4o4RqTwpe+O009QKr7k4w8cFWVgmAyut9GVFN/
zsI50DdOHvjc6/bPmSH5XXA+JZTqG1dcsDVuJdZjSa95cVkjGvPdPaOLou5kyDSu
/1s6FIXJAWqs/VMcsAbaSFwsrvya4wwWQUwwcG/U52azVdemA6f14wKUxGowKDB8
ZDqaUvkLAgMBAAECggEBAIRoVywq3tEt7yGnb3BCFDqFR2T4uLRaUiQqNrFC/erI
jli3qTkh84/QQqZtTJTrd/kT++MnTpDad2uvvYZj8el/2lBfdWLONrDnbM0Oskmd
RIh6LUKA0UbxejhymK4BNJi2lId3SOk5sfzI+jIvwXcE1Gmolwtfv0VLb4coYjvB
s05gQzk5VN2lKaRM1D+CcyoEhFBv31I3QLK5mfMjrEE+j6P1RHT0M3arv4ttT8LK
Fz0tppclrNEs73WX1jCwQuiWDU/wRR0RBkQBh4Xba/n3NHLkLBFr8tdLXaVLUSg5
UAhjbZlPx4hMfcvVnX+wrGMd7BHRccsRdIVu4jDZYyECgYEA5xDRa5jIheEz4mb4
fWPgw7EZb6wVC5lkpdhEfCR4f089Fq0J+mb5p26hcGSxZZaK84t1c6LTB3pexHWJ
BblNPEAXDxGIkzJ1tWcNQeBqbPacxE4iOjW4I0tCa304FVs4F0sbq2JqACMUuu+4
K9Jv8qYNk9GsTW86s26i+IUEzlECgYEAvXT9gQiA28GFg9ZXr8ES19YieL8rS02d
xVhYR/dl/6hrfz7D9ksRKCU0wF1H9LR4kCKB4qCESHiKS9P1vwWe++QygF5JsQ7T
fKCW5+3bThp5Cfw8gMrg7GqLAMKMm+Qtag6f1ES30YTAlbJGVVivGzk7N1xt5D0j
6gmtONJ/rpsCgYEA48+7CaA6o3RjWSY4fDfK1GV5NJausR7tEm3lJ5g1jR8slXzJ
R63bGm6CkHNWS1hfarrmc7nm4YqOgJd5HsGRGoP9uAeLZcTsNIuDkJ2XkBKcgRaf
vFBWWcXLmHp+nt+ur5iHkTOYWsY7nArYw6vYX53D6Sdh/35Ym6vK1ccf8+ECgYAB
L2wulHkJ5uoI6xxdUx3lD8fjbX6919x20ZirypZuxQT3JNNhBRM0ZxcvZOYAV+ix
LiYV3t80/NwQoWDWMxjNhp3yQ6S+YNNd4jtPdCN9F5lOQK+4Noy1rez0skLi7siB
81l4oH1t6CC0Tws1mXpu9yqxq/hcBy3kVu8ofdiipQKBgQCEGQ7TSyz1FaOPQhId
fQm200ToubheG4T4WHxBUWttirSmDepvW+jWHq/qlDzTSoA27c2gHZhJFHay42C7
scN3MeZD1XthDqgglldaYYxH3Qou3jxnhcL4uF3xgGFF24Wvs+/JetcnKoLklvpG
A5WABWxdq7rRDYwwC2gYxrQttQ==
-----END PRIVATE KEY-----`;


key = new NodeRSA();
key.importKey(publicKey);


//key.importKey(privateKey);
// const text = 'Hello RSA!';
// const encrypted = key.encrypt(text, 'base64');
// console.log('encrypted: ', encrypted);
// const decrypted = key.decrypt(encrypted, 'utf8');
// console.log('decrypted: ', decrypted);


module.exports = {
	privateKey,
	publicKey,
	encode: function(text) {
		return key.encrypt(text, 'base64');
	},
	decode: function(encrypted) {
		return key.decrypt(encrypted, 'utf8');
	}
}
