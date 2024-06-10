// Import necessary modules/components
import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Define the Profile component
const Profile = ({ locale }) => {
    const { t } = useTranslation();
    const [activeMenuItem, setActiveMenuItem] = useState('resume-sop'); // State to track active menu item

    // Function to handle menu item clicks
    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem); // Update activeMenuItem state
    };



    return (
        <Layout>
            <Head>
                <title>{t("My Profile")}</title>
                <meta name='description' content={t("My Profile description")} />
                {/* Include Bootstrap Icons CSS */}
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet" />

            </Head>
            <style jsx>{`
                .list-group-item {
                    --bs-list-group-bg: white; /* Override background color */
                }
                .main-content {
                    min-height: calc(100vh - 56px); /* 56px is an example of the height of your header/navbar, adjust as needed */
                }
                .card {
                    height: 100%; /* Set card height to 100% to fill the parent container */
                }
            `}</style>
            <div className="row">
                <div className="col-lg-3 mb-4 order-0">



                    <div className="list-group" role="tablist">
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'resume-sop' ? 'active' : ''}`}
                            href="#resume-sop"
                            onClick={() => handleMenuItemClick('resume-sop')}
                        >
                            <i className="bi bi-file-earmark-text me-2"></i>
                            {t("Resume and SOP")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'personal-details' ? 'active' : ''}`}
                            href="#personal-details"
                            onClick={() => handleMenuItemClick('personal-details')}
                        >
                            <i className="bi bi-person me-2"></i>
                            {t("Personal Details")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'research-interests' ? 'active' : ''}`}
                            href="#research-interests"
                            onClick={() => handleMenuItemClick('research-interests')}
                        >
                            <i className="bi bi-lightbulb me-2"></i>
                            {t("Research Interests")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'academic-history' ? 'active' : ''}`}
                            href="#academic-history"
                            onClick={() => handleMenuItemClick('academic-history')}
                        >
                            <i className="bi bi-journal-text me-2"></i>
                            {t("Academic History")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'dissertation' ? 'active' : ''}`}
                            href="#dissertation"
                            onClick={() => handleMenuItemClick('dissertation')}
                        >
                            <i className="bi bi-file-earmark-bar-graph me-2"></i>
                            {t("Dissertation")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'research-experience' ? 'active' : ''}`}
                            href="#research-experience"
                            onClick={() => handleMenuItemClick('research-experience')}
                        >
                            <i className="bi bi-journal-medical me-2"></i>
                            {t("Research Experience")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'publication' ? 'active' : ''}`}
                            href="#publication"
                            onClick={() => handleMenuItemClick('publication')}
                        >
                            <i className="bi bi-journal-bookmark me-2"></i>
                            {t("Publication")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'work-experience' ? 'active' : ''}`}
                            href="#work-experience"
                            onClick={() => handleMenuItemClick('work-experience')}
                        >
                            <i className="bi bi-briefcase me-2"></i>
                            {t("Work Experience")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'skill' ? 'active' : ''}`}
                            href="#skill"
                            onClick={() => handleMenuItemClick('skill')}
                        >
                            <i className="bi bi-tools me-2"></i>
                            {t("Skill")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'training-workshop' ? 'active' : ''}`}
                            href="#training-workshop"
                            onClick={() => handleMenuItemClick('training-workshop')}
                        >
                            <i className="bi bi-briefcase me-2"></i>
                            {t("Training and Workshop")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'award-grant-scholarships' ? 'active' : ''}`}
                            href="#award-grant-scholarships"
                            onClick={() => handleMenuItemClick('award-grant-scholarships')}
                        >
                            <i className="bi bi-award me-2"></i>
                            {t("Award, Grant and Scholarships")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'test-score' ? 'active' : ''}`}
                            href="#test-score"
                            onClick={() => handleMenuItemClick('test-score')}
                        >
                            <i className="bi bi-card-checklist me-2"></i>
                            {t("Test Score")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'volunteer-activities' ? 'active' : ''}`}
                            href="#volunteer-activities"
                            onClick={() => handleMenuItemClick('volunteer-activities')}
                        >
                            <i className="bi bi-people-fill me-2"></i>

                            {t("Volunteer Activities")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'additional-documents' ? 'active' : ''}`}
                            href="#additional-documents"
                            onClick={() => handleMenuItemClick('additional-documents')}
                        >
                            <i className="bi bi-file-earmark me-2"></i>
                            {t("Additional Documents")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'references' ? 'active' : ''}`}
                            href="#references"
                            onClick={() => handleMenuItemClick('references')}
                        >
                            <i className="bi bi-person-lines-fill me-2"></i>
                            {t("References")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'contact-information' ? 'active' : ''}`}
                            href="#contact-information"
                            onClick={() => handleMenuItemClick('contact-information')}
                        >
                            <i className="bi bi-telephone me-2"></i>
                            {t("Contact Information")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'others-information' ? 'active' : ''}`}
                            href="#others-information"
                            onClick={() => handleMenuItemClick('others-information')}
                        >
                            <i className="bi bi-info-circle me-2"></i>
                            {t("Others Information")}
                        </a>
                        <a
                            className={`list-group-item list-group-item-action ${activeMenuItem === 'acknowledgement' ? 'active' : ''}`}
                            href="#acknowledgement"
                            onClick={() => handleMenuItemClick('acknowledgement')}
                        >
                            <i className="bi bi-journal-check me-2"></i>
                            {t("Acknowledgement")}
                        </a>
                        {/* Add more menu items as needed */}
                    </div>



                </div>
                <div className="col-lg-9 mb-4 order-1 main-content">
                    {/* Main content */}
                    <div className="card">
                        <div className="card-body">
                            {/* Content based on activeMenuItem */}
                            {activeMenuItem === 'resume-sop' && (

                                <div id="account-details-1" className="content dstepper-block active">
                                    <div className="content-header mb-3">
                                        <h6 className="mb-0">Account Details</h6>
                                        <small>Enter Your Account Details.</small>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="username-vertical">Username</label>
                                            <input type="text" id="username-vertical" className="form-control" placeholder="johndoe" />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="email-vertical">Email</label>
                                            <input type="email" id="email-vertical" className="form-control" placeholder="john.doe@email.com" aria-label="john.doe" />
                                        </div>
                                        <div className="col-sm-6 form-password-toggle">
                                            <label className="form-label" htmlFor="password-vertical">Password</label>
                                            <div className="input-group input-group-merge">
                                                <input type="password" id="password-vertical" className="form-control" placeholder="············" aria-describedby="password2-vertical" />
                                                <span className="input-group-text cursor-pointer" id="password2-vertical"><i className="bx bx-hide"></i></span>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 form-password-toggle">
                                            <label className="form-label" htmlFor="confirm-password-vertical">Confirm Password</label>
                                            <div className="input-group input-group-merge">
                                                <input type="password" id="confirm-password-vertical" className="form-control" placeholder="············" aria-describedby="confirm-password-vertical2" />
                                                <span className="input-group-text cursor-pointer" id="confirm-password-vertical2"><i className="bx bx-hide"></i></span>
                                            </div>
                                        </div>
                                        <div className="col-12 d-flex justify-content-between">
                                            <button className="btn btn-label-secondary btn-prev" disabled="">
                                                <i className="bx bx-chevron-left bx-sm ms-sm-n2"></i>
                                                <span className="align-middle d-sm-inline-block d-none">Previous</span>
                                            </button>
                                            <button className="btn btn-primary btn-next">
                                                <span className="align-middle d-sm-inline-block d-none me-sm-1">Next</span>
                                                <i className="bx bx-chevron-right bx-sm me-sm-n2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>



                            )}
                            {activeMenuItem === 'personal-details' && (
                                <div>








                                    <div className="demo-inline-spacing mt-3">
                                        <div className="list-group list-group-success list-group-horizontal-md text-md-center" role="tablist">
                                            <a className="list-group-item list-group-item-action active" id="home-list-item" data-bs-toggle="list" href="#horizontal-home" aria-selected="true" role="tab">Biographic Info</a>
                                            <a className="list-group-item list-group-item-action" id="profile-list-item" data-bs-toggle="list" href="#horizontal-profile" aria-selected="false" tabIndex="-1" role="tab">Contact Info</a>
                                            <a className="list-group-item list-group-item-action" id="messages-list-item" data-bs-toggle="list" href="#horizontal-messages" aria-selected="false" tabIndex="-1" role="tab">Citizen Info</a>
                                            <a className="list-group-item list-group-item-action" id="settings-list-item" data-bs-toggle="list" href="#horizontal-settings" aria-selected="false" tabIndex="-1" role="tab">Ethnicity</a>
                                            <a className="list-group-item list-group-item-action" id="others_info-list-item" data-bs-toggle="list" href="#horizontal-others_info" aria-selected="false" tabIndex="-1" role="tab">Other Info</a>
                                            <a className="list-group-item list-group-item-action" id="acknowledgement-list-item" data-bs-toggle="list" href="#horizontal-acknowledgement" aria-selected="false" tabIndex="-1" role="tab">Acknowledgement</a>
                                        </div>
                                        <div className="tab-content px-0 mt-0">
                                            <div className="tab-pane fade show active" id="horizontal-home" role="tabpanel" aria-labelledby="home-list-item">
                                                <div id="account-details-1" className="content dstepper-block active">
                                                    <div className="content-header mb-3">
                                                        <h6 className="mb-0">Account Details</h6>
                                                        <small>Enter Your Account Details.</small>
                                                    </div>
                                                    <div className="row g-3">
                                                        <div className="col-sm-6">
                                                            <label className="form-label" htmlFor="username-vertical">Username</label>
                                                            <input type="text" id="username-vertical" className="form-control" placeholder="johndoe" />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <label className="form-label" htmlFor="email-vertical">Email</label>
                                                            <input type="email" id="email-vertical" className="form-control" placeholder="john.doe@email.com" aria-label="john.doe" />
                                                        </div>
                                                        <div className="col-sm-6 form-password-toggle">
                                                            <label className="form-label" htmlFor="password-vertical">Password</label>
                                                            <div className="input-group input-group-merge">
                                                                <input type="password" id="password-vertical" className="form-control" placeholder="············" aria-describedby="password2-vertical" />
                                                                <span className="input-group-text cursor-pointer" id="password2-vertical"><i className="bx bx-hide"></i></span>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 form-password-toggle">
                                                            <label className="form-label" htmlFor="confirm-password-vertical">Confirm Password</label>
                                                            <div className="input-group input-group-merge">
                                                                <input type="password" id="confirm-password-vertical" className="form-control" placeholder="············" aria-describedby="confirm-password-vertical2" />
                                                                <span className="input-group-text cursor-pointer" id="confirm-password-vertical2"><i className="bx bx-hide"></i></span>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 d-flex justify-content-between">
                                                            <button className="btn btn-label-secondary btn-prev" disabled="">
                                                                <i className="bx bx-chevron-left bx-sm ms-sm-n2"></i>
                                                                <span className="align-middle d-sm-inline-block d-none">Previous</span>
                                                            </button>
                                                            <button className="btn btn-primary btn-next">
                                                                <span className="align-middle d-sm-inline-block d-none me-sm-1">Next</span>
                                                                <i className="bx bx-chevron-right bx-sm me-sm-n2"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="horizontal-profile" role="tabpanel" aria-labelledby="profile-list-item">
                                                Muffin lemon drops chocolate chupa chups jelly beans dessert jelly-o. Soufflé gummies gummies. Ice cream powder marshmallow cotton candy oat cake wafer. Marshmallow gingerbread tootsie roll. Chocolate cake bonbon jelly beans lollipop jelly beans halvah marzipan danish pie. Oat cake chocolate cake pudding bear claw liquorice gingerbread icing sugar plum brownie. Toffee cookie apple pie cheesecake bear claw sugar plum wafer gummi bears fruitcake.
                                            </div>
                                            <div className="tab-pane fade" id="horizontal-messages" role="tabpanel" aria-labelledby="messages-list-item">
                                                Ice cream dessert candy sugar plum croissant cupcake tart pie apple pie. Pastry chocolate chupa chups tiramisu. Tiramisu cookie oat cake. Pudding brownie bonbon. Pie carrot cake chocolate macaroon. Halvah jelly jelly beans cake macaroon jelly-o. Danish pastry dessert gingerbread powder halvah. Muffin bonbon fruitcake dragée sweet sesame snaps oat cake marshmallow cheesecake. Cupcake donut sweet bonbon cheesecake soufflé chocolate bar.
                                            </div>
                                            <div className="tab-pane fade" id="horizontal-settings" role="tabpanel" aria-labelledby="settings-list-item">
                                                Marzipan cake oat cake. Marshmallow pie chocolate. Liquorice oat cake donut halvah jelly-o. Jelly-o muffin macaroon cake gingerbread candy cupcake. Cake lollipop lollipop jelly brownie cake topping chocolate. Pie oat cake jelly. Lemon drops halvah jelly cookie bonbon cake cupcake ice cream. Donut tart bonbon sweet roll soufflé gummies biscuit. Wafer toffee topping jelly beans icing pie apple pie toffee pudding. Tiramisu powder macaroon tiramisu cake halvah.
                                            </div>
                                            <div className="tab-pane fade" id="horizontal-others_info" role="tabpanel" aria-labelledby="messages-list-item">
                                                Ice cream dessert candy sugar plum croissant cupcake tart pie apple pie. Pastry chocolate chupa chups tiramisu. Tiramisu cookie oat cake. Pudding brownie bonbon. Pie carrot cake chocolate macaroon. Halvah jelly jelly beans cake macaroon jelly-o. Danish pastry dessert gingerbread powder halvah. Muffin bonbon fruitcake dragée sweet sesame snaps oat cake marshmallow cheesecake. Cupcake donut sweet bonbon cheesecake soufflé chocolate bar.
                                            </div>
                                            <div className="tab-pane fade" id="horizontal-acknowledgement" role="tabpanel" aria-labelledby="settings-list-item">
                                                Marzipan cake oat cake. Marshmallow pie chocolate. Liquorice oat cake donut halvah jelly-o. Jelly-o muffin macaroon cake gingerbread candy cupcake. Cake lollipop lollipop jelly brownie cake topping chocolate. Pie oat cake jelly. Lemon drops halvah jelly cookie bonbon cake cupcake ice cream. Donut tart bonbon sweet roll soufflé gummies biscuit. Wafer toffee topping jelly beans icing pie apple pie toffee pudding. Tiramisu powder macaroon tiramisu cake halvah.
                                            </div>
                                        </div>
                                    </div>














                                </div>
                            )}
                            {activeMenuItem === 'research-interests' && (
                                <div>
                                    <h2>{t("Research Interests")}</h2>
                                    {/* Research interests content */}
                                </div>
                            )}
                            {activeMenuItem === 'academic-history' && (
                                <div>
                                    <h2>{t("Academic History")}</h2>
                                    {/* Academic history content */}
                                </div>
                            )}
                            {activeMenuItem === 'dissertation' && (
                                <div>
                                    <h2>{t("Dissertation")}</h2>
                                    {/* Dissertation content */}
                                </div>
                            )}
                            {activeMenuItem === 'research-experience' && (
                                <div>
                                    <h2>{t("Research Experience")}</h2>
                                    {/* Research experience content */}
                                </div>
                            )}
                            {activeMenuItem === 'publication' && (
                                <div>
                                    <h2>{t("Publication")}</h2>
                                    {/* Publication content */}
                                </div>
                            )}
                            {activeMenuItem === 'work-experience' && (
                                <div>
                                    <h2>{t("Work Experience")}</h2>
                                    {/* Work experience content */}
                                </div>
                            )}
                            {activeMenuItem === 'skill' && (
                                <div>
                                    <h2>{t("Skill")}</h2>
                                    {/* Skill content */}
                                </div>
                            )}
                            {activeMenuItem === 'training-workshop' && (
                                <div>
                                    <h2>{t("Training and Workshop")}</h2>
                                    {/* Training and Workshop content */}
                                </div>
                            )}
                            {activeMenuItem === 'award-grant-scholarships' && (
                                <div>
                                    <h2>{t("Award, Grant and Scholarships")}</h2>
                                    {/* Award, Grant and Scholarships content */}
                                </div>
                            )}
                            {activeMenuItem === 'test-score' && (
                                <div>
                                    <h2>{t("Test Score")}</h2>
                                    {/* Test Score content */}
                                </div>
                            )}
                            {activeMenuItem === 'volunteer-activities' && (
                                <div>
                                    <h2>{t("Volunteer Activities")}</h2>
                                    {/* Volunteer Activities content */}
                                </div>
                            )}
                            {activeMenuItem === 'additional-documents' && (
                                <div>
                                    <h2>{t("Additional Documents")}</h2>
                                    {/* Additional Documents content */}
                                </div>
                            )}
                            {activeMenuItem === 'references' && (
                                <div>
                                    <h2>{t("References")}</h2>
                                    {/* References content */}
                                </div>
                            )}
                            {activeMenuItem === 'contact-information' && (
                                <div>
                                    <h2>{t("Contact Information")}</h2>
                                    {/* Contact Information content */}
                                </div>
                            )}
                            {activeMenuItem === 'others-information' && (
                                <div>
                                    <h2>{t("Others Information")}</h2>
                                    {/* Others Information content */}
                                </div>
                            )}
                            {activeMenuItem === 'acknowledgement' && (
                                <div id="social-links-1" className="content dstepper-block active">
                                    <div className="content-header mb-3">
                                        <h6 className="mb-0">Social Links</h6>
                                        <small>Enter Your Social Links.</small>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="twitter-vertical">Twitter</label>
                                            <input type="text" id="twitter-vertical" className="form-control" placeholder="https://twitter.com/abc" />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="facebook-vertical">Facebook</label>
                                            <input type="text" id="facebook-vertical" className="form-control" placeholder="https://facebook.com/abc" />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="google-vertical">Google+</label>
                                            <input type="text" id="google-vertical" className="form-control" placeholder="https://plus.google.com/abc" />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="linkedin-vertical">LinkedIn</label>
                                            <input type="text" id="linkedin-vertical" className="form-control" placeholder="https://linkedin.com/abc" />
                                        </div>
                                        <div className="col-12 d-flex justify-content-between">
                                            <button className="btn btn-primary btn-prev">
                                                <i className="bx bx-chevron-left bx-sm ms-sm-n2"></i>
                                                <span className="align-middle d-sm-inline-block d-none">Previous</span>
                                            </button>
                                            <button className="btn btn-success btn-submit">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Add more content based on other menu items */}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

// Server-side props for internationalization
export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

// Define the layout for the Profile component
Profile.layout = 'default';

// Export the Profile component
export default Profile;

