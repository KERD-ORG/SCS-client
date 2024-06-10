// pages/profile/subpages/personal-details.jsx
import { React, useRef, useState, useCallback, useEffect, useRouter, axios, getToken, executeAjaxOperation, profileTabOrder, PrevNextButtons, Select, CreatableSelect, useTranslation, Loader, CustomAlert } from '../../../utils/commonImports';
import BiographicInfo from './tabs/personal-details/biographic-info';
import ContactInfo from './tabs/personal-details/contact-info';

const PersonalDetails = () => {
    const router = useRouter();
    const { tab } = router.query;
    const { t } = useTranslation('common');
    const [token, setToken] = useState(null);
    const currentIndex = profileTabOrder.indexOf(tab) !== -1 ? profileTabOrder.indexOf(tab) : 0;
    const previousTab = profileTabOrder[currentIndex - 1];
    const nextTab = profileTabOrder[currentIndex + 1];
    const [loading, setLoading] = useState(false);
    const [biographicInfoDetails, setBiographicInfoDetails] = useState(null);
    const [contactInfoDetails, setContactInfoDetails] = useState(null);
    const [globalError, setGlobalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchedToken = getToken();
        if (!fetchedToken) {
            router.push(process.env.NEXT_PUBLIC_URL_SIGNIN);
        } else {
            setToken(fetchedToken);
        }
    }, [router]);

    useEffect(() => {
        if (token) {
            fetchUserBiographicInfoDetails();
            fetchUserContactInfoDetails();
        }
    }, [token]);


    const handleChangeBiographicInfo = (e) => {
        const { name, value } = e.target;
        setBiographicInfoDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleChangeContactInfo = (e) => {
        const { name, value } = e.target;
        setContactInfoDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };



    const fetchUserBiographicInfoDetails = async () => {
        try {
            const response = await executeAjaxOperation({
                url: process.env.NEXT_PUBLIC_API_ENDPOINT_USER_BIOGRAPHIC_INFO_DETAILS,
                method: 'get',
                token,
                locale: router.locale || locale,
            });
            setBiographicInfoDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchUserContactInfoDetails = async () => {
        try {
            const response = await executeAjaxOperation({
                url: process.env.NEXT_PUBLIC_API_ENDPOINT_USER_CONTACT_INFO_DETAILS,
                method: 'get',
                token,
                locale: router.locale || locale,
            });
            setContactInfoDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleNavigation = (targetTab) => {
        const tabElement = document.querySelector(`[href="#${targetTab}"]`);
        if (tabElement) {
            tabElement.click();
        }
    };

    const [activeTab, setActiveTab] = useState('form-tabs-biographic');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div>
            <style jsx>{`
                .tab-content {
                    background: white;
                }
            `}</style>

            <h4 className="mb-4">
                <span className="text-muted fw-light">{t('Profile')} /</span> {t('Personal Details')}
            </h4>
            {globalError && (
                <CustomAlert
                    message={globalError}
                    dismissable={true}
                    timer={parseInt(process.env.NEXT_PUBLIC_ALERT_TIME)}
                    onClose={() => setGlobalError('')}
                    type="danger"
                />
            )}
            {successMessage && (
                <CustomAlert
                    message={successMessage}
                    dismissable={true}
                    timer={parseInt(process.env.NEXT_PUBLIC_ALERT_TIME)}
                    onClose={() => setSuccessMessage('')}
                    type="success"
                />
            )}
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${activeTab === 'form-tabs-biographic' ? 'active' : ''}`} onClick={() => handleTabClick('form-tabs-biographic')} role="tab" aria-selected={activeTab === 'form-tabs-biographic'}>{t('Biographic Info')}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${activeTab === 'form-tabs-contact' ? 'active' : ''}`} onClick={() => handleTabClick('form-tabs-contact')} role="tab" aria-selected={activeTab === 'form-tabs-contact'}>{t('Contact Info')}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${activeTab === 'form-tabs-citizenship' ? 'active' : ''}`} onClick={() => handleTabClick('form-tabs-citizenship')} role="tab" aria-selected={activeTab === 'form-tabs-citizenship'}>{t('Citizenship Info')}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${activeTab === 'form-tabs-ethnicity' ? 'active' : ''}`} onClick={() => handleTabClick('form-tabs-ethnicity')} role="tab" aria-selected={activeTab === 'form-tabs-ethnicity'}>{t('Ethnicity')}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${activeTab === 'form-tabs-other' ? 'active' : ''}`} onClick={() => handleTabClick('form-tabs-other')} role="tab" aria-selected={activeTab === 'form-tabs-other'}>{t('Other Info')}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${activeTab === 'form-tabs-acknowledgement' ? 'active' : ''}`} onClick={() => handleTabClick('form-tabs-acknowledgement')} role="tab" aria-selected={activeTab === 'form-tabs-acknowledgement'}>{t('Acknowledgement')}</button>
                    </li>
                </ul>
                <div className="tab-content">
                    <div className={`tab-pane fade ${activeTab === 'form-tabs-biographic' ? 'show active' : ''}`} id="form-tabs-biographic" role="tabpanel">


                        <BiographicInfo
                            biographicInfoDetails={biographicInfoDetails}
                            setBiographicInfoDetails={setBiographicInfoDetails}
                            setLoading={setLoading}
                            setGlobalError={setGlobalError}
                            setSuccessMessage={setSuccessMessage}
                            fetchUserBiographicInfoDetails={fetchUserBiographicInfoDetails}
                            token={token}
                            t={t}
                            router={router}
                            handleChange={handleChangeBiographicInfo}
                        />



                    </div>
                    <div className={`tab-pane fade ${activeTab === 'form-tabs-contact' ? 'show active' : ''}`} id="form-tabs-contact" role="tabpanel">

                        <ContactInfo
                            contactInfoDetails={contactInfoDetails}
                            setContactInfoDetails={setContactInfoDetails}
                            setLoading={setLoading}
                            setGlobalError={setGlobalError}
                            setSuccessMessage={setSuccessMessage}
                            fetchUserContactInfoDetails={fetchUserContactInfoDetails}
                            token={token}
                            t={t}
                            router={router}
                            handleChange={handleChangeContactInfo}
                        />

                    </div>
                    <div className={`tab-pane fade ${activeTab === 'form-tabs-citizenship' ? 'show active' : ''}`} id="form-tabs-citizenship" role="tabpanel">

                        <button type="submit" className="btn btn-primary mt-3">{t('Submit')}</button>
                    </div>
                    <div className={`tab-pane fade ${activeTab === 'form-tabs-ethnicity' ? 'show active' : ''}`} id="form-tabs-ethnicity" role="tabpanel">

                        <button type="submit" className="btn btn-primary mt-3">{t('Submit')}</button>
                    </div>
                    <div className={`tab-pane fade ${activeTab === 'form-tabs-other' ? 'show active' : ''}`} id="form-tabs-other" role="tabpanel">

                        <button type="submit" className="btn btn-primary mt-3">{t('Submit')}</button>
                    </div>
                    <div className={`tab-pane fade ${activeTab === 'form-tabs-acknowledgement' ? 'show active' : ''}`} id="form-tabs-acknowledgement" role="tabpanel">

                        <button type="submit" className="btn btn-primary mt-3">{t('Submit')}</button>
                    </div>
                </div>

            </div>

            <PrevNextButtons
                previousTab={previousTab}
                nextTab={nextTab}
                handleNavigation={handleNavigation}
            />

            {loading && <Loader />}
        </div>
    );
};

export default PersonalDetails;
