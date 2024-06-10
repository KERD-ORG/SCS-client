import { React, useRef, useState, useCallback, useEffect, useRouter, axios, getToken, executeAjaxOperation, profileTabOrder, PrevNextButtons, Select, CreatableSelect, useTranslation, Loader, CustomAlert } from '../../../utils/commonImports';


const ResearchInterests = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [token, setToken] = useState(null);
    const { tab } = router.query;
    const formRef = useRef(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const currentIndex = profileTabOrder.indexOf(tab) !== -1 ? profileTabOrder.indexOf(tab) : 0;
    const previousTab = profileTabOrder[currentIndex - 1];
    const nextTab = profileTabOrder[currentIndex + 1];

    useEffect(() => {
        const fetchedToken = getToken();
        if (!fetchedToken) {
            router.push(process.env.NEXT_PUBLIC_URL_SIGNIN); // Redirect to login if no token
        } else {
            setToken(fetchedToken); // Set the token in state
        }
    }, [router]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save the form data
        console.log('Form submitted with data:', selectedOptions);
        // Perform form data saving logic here
    };

    const handleNavigation = (targetTab) => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            if (!formRef.current.querySelector(':invalid')) {
                const tabElement = document.querySelector(`[href="#${targetTab}"]`);
                if (tabElement) {
                    tabElement.click();
                }
            }
        }
    };

    const loadOptions = async (inputValue) => {
        try {
            if (!token) return [];

            const response = await executeAjaxOperation({
                url: `${process.env.NEXT_PUBLIC_API_ENDPOINT_RESEARCH_INTERESTS_OPTIONS}?query=${inputValue}`,
                method: 'get',
                token,
                locale: router.locale || locale,
            });

            if (response.success) {
                // Map the response data to the expected format
                return response.data.map(item => ({ label: item.topic, value: item.id }));
            } else {
                console.error('Empty response received');
                return [];
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };



    const handleChange = useCallback((selected) => {
        setSelectedOptions(selected || []);
    }, []);

    if (!token) {
        return <div>Loading...</div>; // Or any loading indicator
    }

    return (
        <div>
            <h4 className="mb-4">
                <span className="text-muted fw-light">{t('Profile')} /</span> {t('Research Interests')}
            </h4>
            <div className="card">
                <div className="card-body">
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="research-interests" className="form-label">{t('Research Interests')}</label>
                            <Select
                                isMulti
                                cacheOptions
                                defaultOptions
                                loadOptions={loadOptions}
                                onChange={handleChange}
                                value={selectedOptions}
                                inputId="research-interests"
                                placeholder={t('Select or type your research interests')}
                                noOptionsMessage={() => t('No options')}
                                formatCreateLabel={(inputValue) => `${t('Create')} "${inputValue}"`}
                                createOptionPosition="first"
                            />
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
        </div>
    );
};

export default ResearchInterests;
