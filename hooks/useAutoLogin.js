import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env'

const useAutoLogin = (onSuccess, onError) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                let rs = await axios.post(`${REACT_APP_BASE_URL}/account/sign-in`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                console.log("data",rs.data);
                if (rs.data.result == "success") {
                    console.log(rs.data);
                    onSuccess(rs.data.account);
                } else {
                    onError();
                }
            } catch (error) {
                onError(error);
            } finally {
                setLoading(false);
            }
        };
        bootstrapAsync();
    }, []);

    return { loading };
};

export default useAutoLogin;
