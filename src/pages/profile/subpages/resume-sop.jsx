import { React, useRef, useState, useCallback, useEffect, useRouter, axios, getToken, executeAjaxOperation, profileTabOrder, PrevNextButtons, Select, CreatableSelect, useTranslation, Loader, CustomAlert } from '../../../utils/commonImports';

const ResumeSOP = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [token, setToken] = useState(null);
    const { tab } = router.query;
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const currentIndex = profileTabOrder.indexOf(tab) !== -1 ? profileTabOrder.indexOf(tab) : 0;
    const previousTab = profileTabOrder[currentIndex - 1];
    const nextTab = profileTabOrder[currentIndex + 1];
    const [globalError, setGlobalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchedToken = getToken();
        if (!fetchedToken) {
            router.push(process.env.NEXT_PUBLIC_URL_SIGNIN); // Redirect to login if no token
        } else {
            setToken(fetchedToken); // Set the token in state
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const resumeFile = formData.get('resume');
        const sopFile = formData.get('sop');

        if (!resumeFile.name && !sopFile.name) {
            setGlobalError(t('Please upload either a Resume or a SOP file.'));
            setSuccessMessage('');
            return;
        }
        if (resumeFile.name && resumeFile.type !== 'application/pdf') {
            setGlobalError(t('Please upload a PDF file for Resume.'));
            setSuccessMessage('');
            return;
        }
        if (sopFile.name && sopFile.type !== 'application/pdf') {
            setGlobalError(t('Please upload a PDF file for SOP.'));
            setSuccessMessage('');
            return;
        }

        try {
            setLoading(true);
            const response = await executeAjaxOperation({
                url: process.env.NEXT_PUBLIC_API_ENDPOINT_UPLOAD_DOCUMENTS,
                method: 'post',
                token,
                formData,
                locale: router.locale || locale,
            });

            if (response.success) {
                setSuccessMessage(response.data.success || t('Form submitted successfully.'));
                setGlobalError('');
                setFormErrors({});
            } else {
                setGlobalError(response.error || t('An error occurred while uploading files.'));
                setSuccessMessage('');
            }
        } catch (error) {
            setGlobalError(t('Error bb uploading files.'));
            setSuccessMessage('');
            console.error(t('Error uploading files:'), error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = (targetTab) => {
        const tabElement = document.querySelector(`[href="#${targetTab}"]`);
        if (tabElement) {
            tabElement.click();
        }
    };

    return (
        <div>

            <h4 className="mb-4">
                <span className="text-muted fw-light">{t('Profile')} /</span> {t('Resume and SOP')}
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
            <div className="card">
                <div className="card-body">
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="resume" className="form-label">{t('Resume')}</label>
                            <input type="file" accept=".pdf" className="form-control" id="resume" name="resume" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sop" className="form-label">{t('SOP')}</label>
                            <input type="file" accept=".pdf" className="form-control" id="sop" name="sop" />
                        </div>
                        <button type="submit" className="btn btn-primary">{t('Submit')}</button>
                    </form>
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

export default ResumeSOP;
