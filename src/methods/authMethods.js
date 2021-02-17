import { createRef } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { API } from './config.js';
import { registerForPushNotificationsAsync } from './notifMethods.js';

export const navigationRef = createRef();

const options = {
	'content-type': 'application/json'
};

export const profileCheck = async () => {
	try {
        // await AsyncStorage.removeItem('@e_beauty__acc');
        let profile = await AsyncStorage.getItem('@e_beauty__acc');

        if (profile) {
            profile = await JSON.parse(profile);
            return profile;
        }

        return null
    } catch (e) {
        return logout();
    }
};

export const login = async (data, success, failure) => {
	try {
		const token = await registerForPushNotificationsAsync();
		console.log('token - ', token);

		data = { ...data, notificationId: token };

		axios
			.post(`${API}accounts/login`, data, {
				headers: options
			})
			.then(res => {
				console.log(res.data);

				if (res.data.success) {
					AsyncStorage.setItem(
						'@e_beauty__beautician',
						JSON.stringify(res.data)
					);
					success();
				} else {
					console.log('Auth failed');
					failure();
				}
			})
			.catch(err => {
				failure(err);
				console.log('error - ', JSON.stringify(err));
			});
	} catch (e) {
		return null;
	}
};

export const register = async (data, success, failure) => {
	try {
		const token = await registerForPushNotificationsAsync();

		data = { ...data, isSeller: true, notificationId: token };
		console.log('from register method - ', data);

		axios
			.post(`${API}accounts/signup`, data, {
				headers: options
			})
			.then(res => {
				console.log(res.data);

				if (res.data.success) {
					AsyncStorage.setItem(
						'@e_beauty__beautician',
						JSON.stringify(res.data)
					);
					success();
				} else {
					console.log('Auth failed');
					failure(res.data.message);
				}
			})
			.catch(err => {
				console.log('error - ', err);
				failure('Could not create account')
			});
	} catch (e) {
		return null;
	}
};

export const serviceMap = async (data) => {

	const { token } = await profileCheck();


}

export const uploadDocuments = async (data, success, failure) => {
	try {
		console.log('data-- ', data);
		const { token } = await profileCheck();
		// console.log(token);

		// let config = {
		// 	method: 'post',
		// 	url: `${API}seller/notifybeautician`,
		// 	headers: {
		// 		'content-type': 'multipart/form-data',
		// 		'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjp0cnVlLCJzZWxsZXJJc0FwcHJvdmVkIjoiZmFsc2UiLCJfaWQiOiI1ZmY4MDEyZGYwOTk2MzJmMzk0MWIzYzQiLCJwcm9kdWN0cyI6W10sImNyZWF0ZWQiOiIyMDIxLTAxLTA4VDA2OjUyOjI5LjYyN1oiLCJuYW1lIjoiS3VzaCIsImVtYWlsIjoia3VzaEB0ZXN0LmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJFJ1SkVna2hDVWJOOUt2QlI4S2JXMU9jOVpzR0FRQzFMVmlFTVVwQ1VpNE5Lbi5BS3ZDNzBHIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhdmF0YXIuY29tL2F2YXRhci9iM2YxZjg1NWE1Yzk4M2Y3MDUyZDg0YTFmZmM2YTA4OD9zMjAwJmQ9cmV0cm8iLCJub3RpZmljYXRpb25JZCI6IkV4cG9uZW50UHVzaFRva2VuW0x5TUFvU0lxQVNXVHl6cm01cS1GTEJdIiwibG9jIjpbMjYuOTEyNDMzNiw3NS43ODcyNzA5XSwiX192IjowfSwiaWF0IjoxNjExMjM0NTA3LCJleHAiOjE2MTE4MzkzMDd9.C3XH0RIgFJLKo45J9YEg0AQP8MLd6100U7mXSguo2cA'
		// 	},
		// 	data: data
		// };

		// axios(config)
		// 	.then(function (res) {
		// 		console.log('aaaaaaaa', res.data);
		// 		console.log(res.data);
		// 	})
		// 	.catch(function (error) {
		// 		console.log(error);
		// });

		// -----------------------------------------------------------

		// axios
		// 	.post(`${API}seller/beauticianLicense`, data, {
		// 		headers: {
		// 			'content-type': 'multipart/form-data',
		// 			'Authorization':
		// 				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjp0cnVlLCJzZWxsZXJJc0FwcHJvdmVkIjoiZmFsc2UiLCJfaWQiOiI1ZmY4MDEyZGYwOTk2MzJmMzk0MWIzYzQiLCJwcm9kdWN0cyI6W10sImNyZWF0ZWQiOiIyMDIxLTAxLTA4VDA2OjUyOjI5LjYyN1oiLCJuYW1lIjoiS3VzaCIsImVtYWlsIjoia3VzaEB0ZXN0LmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJFJ1SkVna2hDVWJOOUt2QlI4S2JXMU9jOVpzR0FRQzFMVmlFTVVwQ1VpNE5Lbi5BS3ZDNzBHIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhdmF0YXIuY29tL2F2YXRhci9iM2YxZjg1NWE1Yzk4M2Y3MDUyZDg0YTFmZmM2YTA4OD9zMjAwJmQ9cmV0cm8iLCJub3RpZmljYXRpb25JZCI6IkV4cG9uZW50UHVzaFRva2VuW0x5TUFvU0lxQVNXVHl6cm01cS1GTEJdIiwibG9jIjpbMjYuOTEyNDMzNiw3NS43ODcyNzA5XSwiX192IjowfSwiaWF0IjoxNjExMjM0NTA3LCJleHAiOjE2MTE4MzkzMDd9.C3XH0RIgFJLKo45J9YEg0AQP8MLd6100U7mXSguo2cA'
		// 		}
		// 	})
		// 	.then(res => {
		// 		console.log('res-----', res);
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});

		// ----------------------------------------------

		// axios
		// 	.post(`localhost:8080/seller/beauticianLicense`, data, {
		// 		headers: {
		// 			// 'content-type': 'multipart/form-data',
		// 			'Authorization':
		// 				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjp0cnVlLCJzZWxsZXJJc0FwcHJvdmVkIjoiZmFsc2UiLCJfaWQiOiI1ZmY4MDEyZGYwOTk2MzJmMzk0MWIzYzQiLCJwcm9kdWN0cyI6W10sImNyZWF0ZWQiOiIyMDIxLTAxLTA4VDA2OjUyOjI5LjYyN1oiLCJuYW1lIjoiS3VzaCIsImVtYWlsIjoia3VzaEB0ZXN0LmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJFJ1SkVna2hDVWJOOUt2QlI4S2JXMU9jOVpzR0FRQzFMVmlFTVVwQ1VpNE5Lbi5BS3ZDNzBHIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhdmF0YXIuY29tL2F2YXRhci9iM2YxZjg1NWE1Yzk4M2Y3MDUyZDg0YTFmZmM2YTA4OD9zMjAwJmQ9cmV0cm8iLCJub3RpZmljYXRpb25JZCI6IkV4cG9uZW50UHVzaFRva2VuW0x5TUFvU0lxQVNXVHl6cm01cS1GTEJdIiwibG9jIjpbMjYuOTEyNDMzNiw3NS43ODcyNzA5XSwiX192IjowfSwiaWF0IjoxNjExMjM0NTA3LCJleHAiOjE2MTE4MzkzMDd9.C3XH0RIgFJLKo45J9YEg0AQP8MLd6100U7mXSguo2cA'
		// 		}
		// 	})
		// 	.then(res => {
		// 		console.log('res-----', res);
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});

		// ----------------------------------------------

		let xhr = new XMLHttpRequest();
		xhr.open('POST', `${API}seller/beauticianLicense`);
		xhr.setRequestHeader("Content-type", "multipart/form-data")
		xhr.setRequestHeader("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjp0cnVlLCJzZWxsZXJJc0FwcHJvdmVkIjoiZmFsc2UiLCJfaWQiOiI1ZmY4MDEyZGYwOTk2MzJmMzk0MWIzYzQiLCJwcm9kdWN0cyI6W10sImNyZWF0ZWQiOiIyMDIxLTAxLTA4VDA2OjUyOjI5LjYyN1oiLCJuYW1lIjoiS3VzaCIsImVtYWlsIjoia3VzaEB0ZXN0LmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJFJ1SkVna2hDVWJOOUt2QlI4S2JXMU9jOVpzR0FRQzFMVmlFTVVwQ1VpNE5Lbi5BS3ZDNzBHIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhdmF0YXIuY29tL2F2YXRhci9iM2YxZjg1NWE1Yzk4M2Y3MDUyZDg0YTFmZmM2YTA4OD9zMjAwJmQ9cmV0cm8iLCJub3RpZmljYXRpb25JZCI6IkV4cG9uZW50UHVzaFRva2VuW0x5TUFvU0lxQVNXVHl6cm01cS1GTEJdIiwibG9jIjpbMjYuOTEyNDMzNiw3NS43ODcyNzA5XSwiX192IjowfSwiaWF0IjoxNjExMjM0NTA3LCJleHAiOjE2MTE4MzkzMDd9.C3XH0RIgFJLKo45J9YEg0AQP8MLd6100U7mXSguo2cA")
		xhr.send(data);

		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				// Typical action to be performed when the document is ready:
				const res = JSON.parse(xhr.responseText)
				if(res.success){
					console.log(res);
					success();
				}
				else {
					console.log('eee', res)
					failure('Could not upload documents. Try again later')
				}
			}
		};
	} catch (e) {
		console.log('ee', e);
	}
};

export const logout = async () => {
    try {
        console.log('in logout method');

        if (AsyncStorage.getItem('@e_beauty__beautician')) {
            const { token } = await profileCheck();

            await AsyncStorage.removeItem('@e_beauty__beautician');

            clearNotificationToken(token);
        } else resetToAuth()

        // next();
    } catch (e) {
        console.log(e);
    }
};

export const clearNotificationToken = async token => {
    console.log('in clearNotificationToken method');
    axios
        .post(`${API}accounts/clearnotification`, null, {
            headers: {
                ...options,
                authorization: token
            }
        })
        .then(res => {
            resetToAuth();
            return null;
        })
        .catch(e => {
            console.log(e);
            return null;
        });
};

export const resetToAuth = () => {console.log('in resettoauth')
    navigationRef.current?.reset({
        index: 0,
        routes: [
            {
                name: 'Auth',
                params: {
                    screen: 'Login',
                    message: 'Your session expired. Please login to continue'
                }
            }
        ]
    });
};

