// src/pages/signup/index.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Loader from '../../components/Loader';
import Layout from '../../components/layout_auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useLocalization from '../../hooks/useLocalization';
import { SIGNUP_MESSAGES } from '../messages';


export default function Signup( {locale} ) {
    
    const { t, localizedPath } = useLocalization();
    const router = useRouter();
    const [loading, setLoading] = useState(false); 

    const [firstName, setFirstname] = useState('');
    const [middleName, setMiddlename] = useState('');
    const [lastName, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [agreeTerms, setAgreeTerms] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const validate = () => {
        let tempErrors = {};
        //tempErrors.email = /$^|.+@.+..+/.test(email) ? "" : "Enter a valid email address.";
        tempErrors.confirmPassword = password === confirmPassword ? "" : t(SIGNUP_MESSAGES.passwordsDoNotMatch) ;
        tempErrors.agreeTerms = agreeTerms ? "" : t(SIGNUP_MESSAGES.pleaseAgree);
        setErrors(tempErrors);
    
        return Object.values(tempErrors).every(x => x === "");
    };

    useEffect(() => {
        const fetchRoles = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_ENDPOINT_ROLES}`);
            const data = await response.json();
            setRoles(data);
        };

        fetchRoles();
    }, []);

    

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!executeRecaptcha) {
            return;
          }
          const gReCaptchaToken = await executeRecaptcha();

         //console.log(gReCaptchaToken, "response Google reCaptcha server");
        
        if (!validate()) return;

        setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_ENDPOINT_REGISTER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': router.locale || locale,
            },
            body: JSON.stringify({
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                username,
                email,
                password,
                role,
                gRecaptchaToken: gReCaptchaToken
            }),
        });

        const data = await response.json();

        setLoading(false); // Hide loader

        if (response.ok) {
            setFirstname('');
            setMiddlename('');
            setLastname('');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setRole('');
            setErrors({});
            sessionStorage.setItem('registered', 'true');
            router.push('/signin');
        } else {
            const newErrors = {};
            if (data.username) newErrors.username = data.username.join(' ');
            if (data.email) newErrors.email = data.email.join(' ');
            if (data.password) newErrors.password = data.password.join(' ');
            if (data.first_name) newErrors.firstName = data.first_name.join(' ');
            if (data.middle_name) newErrors.middleName = data.middle_name.join(' ');
            if (data.last_name) newErrors.lastName = data.last_name.join(' ');
            setErrors(newErrors);
        }
    };



    return (
        <Layout>
            <Head>
                <title>{t(SIGNUP_MESSAGES.signUp)}</title>
                <meta name='description' content='Learn more about us.' />
            </Head>
            <div className="card">
                <div className="card-body">



                    <div className="app-brand justify-content-center">
                        <a href={localizedPath('/')} className="app-brand-link gap-2">
                            <span className="app-brand-logo demo">
                                <svg
                                    width={25}
                                    viewBox="0 0 25 42"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <defs>
                                        <path
                                            d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z"
                                            id="path-1"
                                        />
                                        <path
                                            d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z"
                                            id="path-3"
                                        />
                                        <path
                                            d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z"
                                            id="path-4"
                                        />
                                        <path
                                            d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z"
                                            id="path-5"
                                        />
                                    </defs>
                                    <g
                                        id="g-app-brand"
                                        stroke="none"
                                        strokeWidth={1}
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <g id="Brand-Logo" transform="translate(-27.000000, -15.000000)">
                                            <g id="Icon" transform="translate(27.000000, 15.000000)">
                                                <g id="Mask" transform="translate(0.000000, 8.000000)">
                                                    <mask id="mask-2" fill="white">
                                                        <use xlinkHref="#path-1" />
                                                    </mask>
                                                    <use fill="#696cff" xlinkHref="#path-1" />
                                                    <g id="Path-3" mask="url(#mask-2)">
                                                        <use fill="#696cff" xlinkHref="#path-3" />
                                                        <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-3" />
                                                    </g>
                                                    <g id="Path-4" mask="url(#mask-2)">
                                                        <use fill="#696cff" xlinkHref="#path-4" />
                                                        <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-4" />
                                                    </g>
                                                </g>
                                                <g
                                                    id="Triangle"
                                                    transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) "
                                                >
                                                    <use fill="#696cff" xlinkHref="#path-5" />
                                                    <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-5" />
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            <span className="app-brand-text demo text-body fw-bold">{process.env.NEXT_PUBLIC_DOMAIN_NAME}</span>
                        </a>
                    </div>

                    <h4 className="mb-2">{t(SIGNUP_MESSAGES.startYourJourney)}</h4>
                    <p className="mb-4">{t(SIGNUP_MESSAGES.joinOurPlatform)}!</p>

                    

                    <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>

                        <div className="row">
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label htmlFor="first_name" className="form-label">
                                    {t(SIGNUP_MESSAGES.firstName)}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        name="first_name"
                                        placeholder={t('Enter your first name')}
                                        autoFocus=""
                                        value={firstName}
                                        onChange={e => setFirstname(e.target.value)}
                                    />
                                    {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="last_name" className="form-label">
                                    {t(SIGNUP_MESSAGES.lastName)}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        name="last_name"
                                        placeholder={t('Enter your last name')}
                                        autoFocus=""
                                        value={lastName}
                                        onChange={e => setLastname(e.target.value)}
                                    />
                                    {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                    {t(SIGNUP_MESSAGES.email)}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder={t('Enter your email')}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>





                                <div className="mb-3 form-password-toggle">
                                    <label className="form-label" htmlFor="password">
                                    {t(SIGNUP_MESSAGES.password)}
                                    </label>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="············"
                                            aria-describedby="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer">
                                            <i className="bx bx-hide" />
                                        </span>
                                    </div>
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>


                            </div>
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label htmlFor="last_name" className="form-label">
                                    {t(SIGNUP_MESSAGES.middleName)}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="middle_name"
                                        name="middle_name"
                                        placeholder={t('Enter your middle name')}
                                        autoFocus=""
                                        value={middleName}
                                        onChange={e => setMiddlename(e.target.value)}
                                    />
                                    {errors.middleName && <div className="text-danger">{errors.middleName}</div>}
                                </div>



                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                    {t(SIGNUP_MESSAGES.username)}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        name="username"
                                        placeholder={t('Enter your username')}
                                        autoFocus=""
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                    {errors.username && <div className="text-danger">{errors.username}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t('Role')}</label>
                                    <select
                                        className="form-control"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    >
                                        <option value="">{t('Select your role')}</option>
                                        {roles.map((roleName) => (
                                            <option key={roleName} value={roleName}>
                                                {roleName}
                                            </option>
                                        ))}
                                    </select>
                                </div>





                                <div className="mb-3 form-password-toggle">
                                    <label className="form-label" htmlFor="confirm_password">
                                    {t(SIGNUP_MESSAGES.confirmPassword)}
                                    </label>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="confirm_password"
                                            className="form-control"
                                            name="confirm_password"
                                            placeholder="············"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer">
                                            <i className="bx bx-hide" />
                                        </span>
                                    </div>
                                    {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                                </div>


                            </div>

                        </div>

                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="terms-conditions"
                                    name="terms"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="terms-conditions">
                                {t(SIGNUP_MESSAGES.agreeToTerms)} <a href="#">{t(SIGNUP_MESSAGES.privacyPolicyAndTerms)}</a>
                                </label>
                                {errors.agreeTerms && <div className="text-danger">{errors.agreeTerms}</div>}
                            </div>
                        </div>

                                        
	  
                        
                        <button className="btn btn-primary d-grid w-100">{t(SIGNUP_MESSAGES.signUp)}</button>
                    </form>
                    <p className="text-center">
                        <span>{t(SIGNUP_MESSAGES.alreadyHaveAnAccount)} </span>
                        <a href={localizedPath(`${process.env.NEXT_PUBLIC_URL_SIGNIN}`)}>
                            <span>{t(SIGNUP_MESSAGES.signInInstead)}</span>
                        </a>
                    </p>

                </div>
            </div>
            {loading && <Loader />}                                 
        </Layout>
    );
}

export async function getServerSideProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])), // Load the 'common' namespace
      },
    };
}

Signup.layout = 'auth';
Signup.requiresReCaptcha = true;