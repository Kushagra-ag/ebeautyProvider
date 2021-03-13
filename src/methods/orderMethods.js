import axios from 'axios';
import { API } from './config.js';
import { profileCheck } from './authMethods.js';

const options = {
	'content-type': 'application/json'
};

export const acceptRequest = async (data, success, failure) => {

	try{

    const { token } = await profileCheck();
    // console.log(token)
    console.log(data)

	axios
		.post(`${API}seller/acceptOrder`, data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => {console.log(res.data)

            if(res.data.success) {
                console.log(res.data.message);

                success()
            }
            else {
                failure()
            }
        })
        .catch(err => {
            console.log('error from accept req method',  err.response.data)
        })
    } catch(e) {
        conosle.log('from catch', e)
    }
}

export const fetchProduct = (id, next, qty) => {
    axios
        .get(`${API}product/${id}`, {
            headers: options
        })
        .then(res => {
            // console.log('succ?-', res.data.success);
            if (res.data.success) {
                next({
                    name: res.data.product.displayName,
                    title: res.data.product.title,
                    price: res.data.product.price,
                    totalPrice: res.data.product.price * qty,
                    _id: res.data.product._id,
                    img: res.data.product.image,
                    description: res.data.product.description,
                    qty: qty || 1
                });
            } else return null;
        })
        .catch(e => null);
};