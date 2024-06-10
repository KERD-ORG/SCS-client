import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/layout_auth';
import Loader from '../../components/Loader';
import axios from 'axios';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useLocalization from '../../hooks/useLocalization';
import { RESET_PASSWORD_MESSAGES } from '../messages';

export default function ResetPassword({ token, locale }) {
    const { t, localizedPath } = useLocalization();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [showFields, setShowFields] = useState(true); 
    const [errorToken, setErrorToken] = useState(false); 
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_ENDPOINT_PASSWORD_RESET_VALIDATE_TOKEN}`, { token }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => {

            setShowFields(true);
            setError('');
        })
        .catch(error => {
   
            setError(t(RESET_PASSWORD_MESSAGES.invalidToken));
            setShowFields(false);
            setErrorToken(true); 

        }).finally(() => {

            setLoading(false);
        });

    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setMessage('');
            setError('');
            setErrors({});
            setErrorToken(false); 

            
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_ENDPOINT_PASSWORD_RESET_CONFIRM}`, 
                { 
                    token, 
                    password, 
                    confirm_password: confirmPassword 
                },
                {
                    headers: {
                        'Accept-Language': router.locale || locale,
                    },
                }
            );
    
            setMessage(t(RESET_PASSWORD_MESSAGES.passwordResetSuccess));
            setShowFields(false); 
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setErrors(errorData);
                
                let errorMessage = t(RESET_PASSWORD_MESSAGES.fixErrors) ;
                for (const field in errorData) {
                    errorMessage += ` ${errorData[field].join(' ')}`;
                }
                setError(errorMessage);
            } else {
                setError(t(RESET_PASSWORD_MESSAGES.errorResettingPassword) );
            }
        }
    };
    

    const getCookie = (name) => {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    };

    return (
        <Layout>
            <Head>
                <title>{t(RESET_PASSWORD_MESSAGES.resetPasswordButton)}</title>
                <meta name='description' content='Reset Password Page' />
            </Head>
            <div className="card">
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    {!errorToken && !message && ( 
                        <React.Fragment>
                            <h4 className="mb-2">{t(RESET_PASSWORD_MESSAGES.resetPasswordButton)} 🔒</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">{t(RESET_PASSWORD_MESSAGES.newPasswordLabel)}</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        placeholder={t('Enter your new password')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">{t(RESET_PASSWORD_MESSAGES.confirmPasswordLabel)}</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    
                                </div>
                                
                                <button className="btn btn-primary d-grid w-100">{t('Reset Password')}</button>
                            </form>
                        </React.Fragment>
                    )}
                    {message && <div className="alert alert-success" role="alert">{message}</div>}
                </div>
            </div>
            {loading && <Loader />}
        </Layout>
    );
}


ResetPassword.layout = 'auth';

export async function getServerSideProps(context) {
    const { token, locale } = context.query;
    let translations = {};
    if (context.locale) {
        translations = await serverSideTranslations(context.locale, ['common']);
    }
    return {
        props: { token, ...translations }
    };
}
