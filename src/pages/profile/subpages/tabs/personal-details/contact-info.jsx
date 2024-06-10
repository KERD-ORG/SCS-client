import {
    React, useRef, useState, executeAjaxOperation
} from '../../../../../utils/commonImports';

const ContactInfo = ({ contactInfoDetails, setLoading, setGlobalError, setSuccessMessage, token, t, router, handleChange }) => {
    const formContactRef = useRef(null);
    const [formErrors, setFormErrors] = useState({});
    const [showPermanentAddress, setShowPermanentAddress] = useState(contactInfoDetails?.permanent_address_status || false);

    const togglePermanentAddress = () => {
        setShowPermanentAddress(!showPermanentAddress);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            const response = await executeAjaxOperation({
                url: process.env.NEXT_PUBLIC_API_ENDPOINT_USER_CONTACT_INFO_DETAILS,
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
            <form ref={formContactRef} onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="current-address-line1">{t('Current Address Line 1')}</label>
                        <input
                            type="text"
                            id="current-address-line1"
                            name="current_address_line1"
                            className="form-control"
                            placeholder={t('Current Address Line 1')}
                            aria-label={t('Current Address Line 1')}
                            value={contactInfoDetails?.current_address_line1 || ''}
                            onChange={handleChange}
                        />
                        {formErrors.current_address_line1 && (
                            <div className="text-danger">{formErrors.current_address_line1}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="current-address-line2">{t('Current Address Line 2')}</label>
                        <input
                            type="text"
                            id="current-address-line2"
                            name="current_address_line2"
                            className="form-control"
                            placeholder={t('Current Address Line 2')}
                            aria-label={t('Current Address Line 2')}
                            value={contactInfoDetails?.current_address_line2 || ''}
                            onChange={handleChange}
                        />
                        {formErrors.current_address_line2 && (
                            <div className="text-danger">{formErrors.current_address_line2}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="current-city">{t('Current City')}</label>
                        <input
                            type="number"
                            id="current-city"
                            name="current_city"
                            className="form-control"
                            placeholder={t('Current City')}
                            aria-label={t('Current City')}
                            value={contactInfoDetails?.current_city || ''}
                            onChange={handleChange}
                        />
                        {formErrors.current_city && (
                            <div className="text-danger">{formErrors.current_city}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="current-state-province">{t('Current State/Province')}</label>
                        <input
                            type="number"
                            id="current-state-province"
                            name="current_state_province"
                            className="form-control"
                            placeholder={t('Current State/Province')}
                            aria-label={t('Current State/Province')}
                            value={contactInfoDetails?.current_state_province || ''}
                            onChange={handleChange}
                        />
                        {formErrors.current_state_province && (
                            <div className="text-danger">{formErrors.current_state_province}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="current-postal-code">{t('Current Postal Code')}</label>
                        <input
                            type="text"
                            id="current-postal-code"
                            name="current_postal_code"
                            className="form-control"
                            placeholder={t('Current Postal Code')}
                            aria-label={t('Current Postal Code')}
                            value={contactInfoDetails?.current_postal_code || ''}
                            onChange={handleChange}
                        />
                        {formErrors.current_postal_code && (
                            <div className="text-danger">{formErrors.current_postal_code}</div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label" htmlFor="current-country">{t('Current Country')}</label>
                        <input
                            type="number"
                            id="current-country"
                            name="current_country"
                            className="form-control"
                            placeholder={t('Current Country')}
                            aria-label={t('Current Country')}
                            value={contactInfoDetails?.current_country || ''}
                            onChange={handleChange}
                        />
                        {formErrors.current_country && (
                            <div className="text-danger">{formErrors.current_country}</div>
                        )}
                    </div>
                    <div className="col-sm-12 mb-3"> {/* Added mb-3 class for bottom margin */}
                        <div className="form-check"> {/* Wrap checkbox and label in a div with form-check class */}
                            <input
                                type="checkbox"
                                id="permanent-address-status"
                                name="permanent_address_status"
                                className="form-check-input"
                                checked={showPermanentAddress} 
                                onChange={togglePermanentAddress}
                            />
                            <label className="form-check-label ms-2" htmlFor="permanent-address-status">{t('Is this your permanent address?')}</label> {/* Added ms-2 class for left margin */}
                        </div>

                        {formErrors.permanent_address_status && (
                            <div className="text-danger">{formErrors.permanent_address_status}</div>
                        )}
                    </div>
                    {showPermanentAddress && ( 
                        <>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="permanent-address-line1">{t('Permanent Address Line 1')}</label>
                                <input
                                    type="text"
                                    id="permanent-address-line1"
                                    name="permanent_address_line1"
                                    className="form-control"
                                    placeholder={t('Permanent Address Line 1')}
                                    aria-label={t('Permanent Address Line 1')}
                                    value={contactInfoDetails?.permanent_address_line1 || ''}
                                    onChange={handleChange}
                                />
                                {formErrors.permanent_address_line1 && (
                                    <div className="text-danger">{formErrors.permanent_address_line1}</div>
                                )}
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="permanent-address-line2">{t('Permanent Address Line 2')}</label>
                                <input
                                    type="text"
                                    id="permanent-address-line2"
                                    name="permanent_address_line2"
                                    className="form-control"
                                    placeholder={t('Permanent Address Line 2')}
                                    aria-label={t('Permanent Address Line 2')}
                                    value={contactInfoDetails?.permanent_address_line2 || ''}
                                    onChange={handleChange}
                                />
                                {formErrors.permanent_address_line2 && (
                                    <div className="text-danger">{formErrors.permanent_address_line2}</div>
                                )}
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="permanent-city">{t('Permanent City')}</label>
                                <input
                                    type="number"
                                    id="permanent-city"
                                    name="permanent_city"
                                    className="form-control"
                                    placeholder={t('Permanent City')}
                                    aria-label={t('Permanent City')}
                                    value={contactInfoDetails?.permanent_city || ''}
                                    onChange={handleChange}
                                />
                                {formErrors.permanent_city && (
                                    <div className="text-danger">{formErrors.permanent_city}</div>
                                )}
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="permanent-state-province">{t('Permanent State/Province')}</label>
                                <input
                                    type="number"
                                    id="permanent-state-province"
                                    name="permanent_state_province"
                                    className="form-control"
                                    placeholder={t('Permanent State/Province')}
                                    aria-label={t('Permanent State/Province')}
                                    value={contactInfoDetails?.permanent_state_province || ''}
                                    onChange={handleChange}
                                />
                                {formErrors.permanent_state_province && (
                                    <div className="text-danger">{formErrors.permanent_state_province}</div>
                                )}
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="permanent-postal-code">{t('Permanent Postal Code')}</label>
                                <input
                                    type="text"
                                    id="permanent-postal-code"
                                    name="permanent_postal_code"
                                    className="form-control"
                                    placeholder={t('Permanent Postal Code')}
                                    aria-label={t('Permanent Postal Code')}
                                    value={contactInfoDetails?.permanent_postal_code || ''}
                                    onChange={handleChange}
                                />
                                {formErrors.permanent_postal_code && (
                                    <div className="text-danger">{formErrors.permanent_postal_code}</div>
                                )}
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="permanent-country">{t('Permanent Country')}</label>
                                <input
                                    type="number"
                                    id="permanent-country"
                                    name="permanent_country"
                                    className="form-control"
                                    placeholder={t('Permanent Country')}
                                    aria-label={t('Permanent Country')}
                                    value={contactInfoDetails?.permanent_country || ''}
                                    onChange={handleChange}
                                />
                                {formErrors.permanent_country && (
                                    <div className="text-danger">{formErrors.permanent_country}</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <button type="submit" className="btn btn-primary mt-3">{t('Submit')}</button>
            </form>
        </div>
    );
};

export default ContactInfo;
