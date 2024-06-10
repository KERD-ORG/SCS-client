// pages/profile/subpages/tabs/personal-details/biographic-info.jsx
import {
    React, useRef, useState, executeAjaxOperation
} from '../../../../../utils/commonImports';


const BiographicInfo = ({ biographicInfoDetails, setLoading, setGlobalError, setSuccessMessage, token, t, router, handleChange }) => {
    const formRef = useRef(null);
    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            const response = await executeAjaxOperation({
                url: process.env.NEXT_PUBLIC_API_ENDPOINT_USER_BIOGRAPHIC_INFO_DETAILS,
                method: 'post',
                token,
                formData,
                locale: router.locale || locale,
            });

            if (response.success) {
                setSuccessMessage(response.data.message || t('Form submitted successfully.'));
                setGlobalError('');
                setFormErrors({});
            } else {
                if (response.error && response.error.details) {
                    const newFormErrors = { ...formErrors };
                    Object.keys(response.error.details).forEach((field) => {
                        newFormErrors[field] = response.error.details[field][0];
                    });
                    setFormErrors(newFormErrors);
                }
                setGlobalError(response.error.error || t('An error occurred while submitting the form.'));
                setSuccessMessage('');
            }
        } catch (error) {
            console.log(error)
            let errorMessage = t('An error occurred while submitting the form.');
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }
            setGlobalError(errorMessage);
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <form ref={formRef} onSubmit={handleSubmit}>

                <div className="row g-3">
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="first-name">{t('First Name')}</label>
                        <input
                            type="text"
                            id="first-name"
                            name="first_name"
                            className="form-control"
                            placeholder={t('First Name')}
                            aria-label={t('First Name')}
                            value={biographicInfoDetails?.first_name || ''}
                            onChange={handleChange}
                        />
                        {formErrors.first_name && (
                            <div className="text-danger">{formErrors.first_name}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="last-name">{t('Last Name')}</label>
                        <input
                            type="text"
                            id="last-name"
                            name="last_name"
                            className="form-control"
                            placeholder={t('Last Name')}
                            aria-label={t('Last Name')}
                            value={biographicInfoDetails?.last_name || ''}
                            onChange={handleChange}
                        />
                        {formErrors.last_name && (
                            <div className="text-danger">{formErrors.last_name}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="middle-name">{t('Middle Name')}</label>
                        <input
                            type="text"
                            id="middle-name"
                            name="middle_name"
                            className="form-control"
                            placeholder={t('Middle Name')}
                            aria-label={t('Middle Name')}
                            value={biographicInfoDetails?.middle_name || ''}
                            onChange={handleChange}
                        />
                        {formErrors.middle_name && (
                            <div className="text-danger">{formErrors.middle_name}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="date-of-birth">{t('Date of Birth')}</label>
                        <input
                            type="date"
                            id="date-of-birth"
                            name="date_of_birth"
                            className="form-control"
                            aria-label={t('Date of Birth')}
                            value={biographicInfoDetails?.date_of_birth || ''}
                            onChange={handleChange}
                        />
                        {formErrors.date_of_birth && (
                            <div className="text-danger">{formErrors.date_of_birth}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="city-of-birth">{t('City of Birth')}</label>
                        <input
                            type="text"
                            id="city-of-birth"
                            name="city_of_birth"
                            className="form-control"
                            placeholder={t('City of Birth')}
                            aria-label={t('City of Birth')}
                            value={biographicInfoDetails?.city_of_birth || ''}
                            onChange={handleChange}
                        />
                        {formErrors.city_of_birth && (
                            <div className="text-danger">{formErrors.city_of_birth}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="country-of-birth">{t('Country of Birth')}</label>
                        <input
                            type="text"
                            id="country-of-birth"
                            name="country_of_birth"
                            className="form-control"
                            placeholder={t('Country of Birth')}
                            aria-label={t('Country of Birth')}
                            value={biographicInfoDetails?.country_of_birth || ''}
                            onChange={handleChange}
                        />
                        {formErrors && formErrors.country_of_birth && (
                            <div className="text-danger">{formErrors.country_of_birth}</div>
                        )}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">{t('Submit')}</button>
            </form>
        </div>
    );
};

export default BiographicInfo;