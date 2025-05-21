import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IAcomisteApi from './axiosInstance';


export const check = async () => {
    try {

        const cookie = await AsyncStorage.getItem('cookie');
        const response = await IAcomisteApi.get('/api/auth/check', { headers: { 'Cookie': cookie } });
        //return response.data;
        console.log("valor de check: ", response.data);
    } catch (error) {
        console.log(error);
    }
};

export const login = async (email, password) => {
    try {
        const response = await IAcomisteApi.post('/api/auth/login', { email, password });
        const setCookieHeader = response.headers['set-cookie'];

        if(setCookieHeader && setCookieHeader.length > 0) {
            await AsyncStorage.setItem('cookie', setCookieHeader[0]);
        }
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("valor del error: ", error.message);
    }
};

export const signup = async (email, password, name, patLastName, matLastName, phone) => {
    try {
        const response = await axios.post(IAcomisteApi + '/api/auth/register', { email, password, name, patLastName, matLastName, phone });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const verify = async (token) => {
    const response = await axios.get(IAcomisteApi + '/api/auth/verify/1/' + token );
    return response.data;
};

export const reSendToken = async (num) => {
    const response = await axios.get(IAcomisteApi + '/api/auth/resend-token' +  num);
    return response.data;
};

export const changePassword = async (password, newPassword) => {
    const response = await axios.put(IAcomisteApi + '/api/auth/changePassword', { password, newPassword });
    return response.data;
};

export const logout = async () => {
    const response = await IAcomisteApi.delete('/api/auth/logout');
    //return response.data;
    console.log("valor de logout: ", response.data);
};


//Servicio de prueba muestra de uso de cookes 

/*Las cookies se guardan en el storage del dispositivo, que en este caso AsyncStorage y esto sucede dentro de la llmada del login, ya esta funcional, para usarlos en cualquier llammada solo tiene que mandarla a llamar en una cosntante y setear esa constante en el header de la llamada
  para este ejemplo para comprobar que funcionara, se lo integre a un boton dentro de la vista de profile debajo del boton de logout, mañana lo borro Jajajaj, tambien si tienes pedos con la parte del logout, por que de repende se buguea, solo descomenta la llamada del logout en el login, esta dentro del useEffect, cierra la aplicacion y la vuelves abrir. */

export const allrecipe = async () => {
    try {
        const cookie = await AsyncStorage.getItem('cookie'); //Se obtiene la cookie del storage del dispositivo
        const response = await IAcomisteApi.get('/api/recipes/all/1', { headers: { 'Cookie': cookie } }); //Se manda la cookie en el header de la llamada
        console.log("valor de allrecipe: ", response.data); 
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
