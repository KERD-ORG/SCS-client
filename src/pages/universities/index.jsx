// src/pages/universities/index.js
import React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../../components/layout';
import { withAuthServerSideProps } from '../../utils/withAuthServerSideProps';
import { useState, useEffect } from 'react'
import Link from 'next/link';
import { isLoggedIn, logout, getToken } from '../../utils/auth';
import UniversityForm from '../../components/UniversityForm';
import { useRouter } from 'next/router';
import { Offcanvas, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useUserPermissions } from '../../contexts/UserPermissionsContext';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


export default function UniversityList() {

    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [viewUniversity, setViewUniversity] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [formMode, setFormMode] = useState('create'); 
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const token = getToken(); // Retrieve the token
    
    const router = useRouter();
    const isAuthenticated = isLoggedIn();
    
    const { t } = useTranslation('common');
    
    const permissions = useUserPermissions();
    const canAdd = permissions.some(permission => permission.codename === "add_university");
    const canEdit = permissions.some(permission => permission.codename === "change_university");
    const canDetails = permissions.some(permission => permission.codename === "view_university");
    const canDelete = permissions.some(permission => permission.codename === "delete_university");

    function getCsrfToken() {
        return document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
    }

    function fetchUniversities() {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/`, {
            headers: {
                'Authorization': `Token ${token}`, 
            },
        })
                .then((response) => response.json())
                .then((data) => setUniversities(data))
                .catch((error) => console.error('Error fetching universities:', error));
    }

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin');
            return;
        }
        fetchUniversities();
    }, []);

    

    function deleteUniversity(id) {
        
        const isConfirmed = confirm("Are you sure you want to delete this university?");

        if (isConfirmed) {
           
            const token = getToken(); 
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`
                },
                credentials: 'include',
            })
                    .then(response => {
                        console.log(response)
                        if (response.ok) {
                            
                            setUniversities(universities.filter(uni => uni.id !== id));
                            setSuccessMessage('University deleted successfully');
                        } else {
                            
                            console.error('Failed to delete university');
                            setErrorMessage("Failed to delete university");
                           
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        setErrorMessage(error.message);
                    });
        } else {
            
            console.log("Deletion cancelled.");
        }
    }

    const handleFormSubmit = (data) => {
        const url = formMode === 'create'
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/create/`
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/${selectedUniversity.id}/`;
        const method = formMode === 'create' ? 'POST' : 'PUT';

        fetch(url, {
            method,
            headers: {
                // 'Content-Type': 'application/json', 
                'Authorization': `Token ${getToken()}`, 
            },
            body: data, 
        })
                .then(async response => {
                    if (!response.ok) {
                        if (response.status === 400) {
                            const errorData = await response.json();
                            setFormErrors(errorData); 
                            throw new Error("Validation failed");
                        }
                        throw new Error('An error occurred. Please try again.');
                    }
                    return response.json();
                })
                .then(data => {
                    
                    setSuccessMessage(formMode === 'create' ? 'University created successfully' : 'University updated successfully');
                    fetchUniversities(); 
                    const offcanvasElement = document.getElementById('add-new-record');
                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (offcanvasInstance) {
                        offcanvasInstance.hide();
                    }
                    setFormErrors({}); 
                })
                .catch(error => {
                    console.error('Error:', error);
                    setErrorMessage(error.message);
                });
    };

    const openCreateForm = () => {
        setFormMode('create');
        setSelectedUniversity(null);
        setShowOffcanvas(true);
    };

    const openEditForm = (university) => {
        console.log('Opening edit form for:', university); 
        setFormMode('edit');
        setSelectedUniversity(university);
        setShowOffcanvas(true); 
        setFormErrors({}); 
    };
    
    const openShowView = (university) => {
        console.log('Opening show view for:', university);
        setViewUniversity(university); // 
        /*const detailsOffcanvas = document.getElementById('show-details');
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(detailsOffcanvas);
        if (offcanvasInstance) {
            offcanvasInstance.show();
        } else {
            const newOffcanvasInstance = new bootstrap.Offcanvas(detailsOffcanvas);
            newOffcanvasInstance.show();
        }*/
    };



    return (
            <Layout>
                <Head>
                    <title>{t('Universities')}</title>
                    <meta name='description' content='Learn more about us.' />
                </Head>
            
                <h4 className="py-3 mb-4">
                    <span className="text-muted fw-light">{t('Universities')} /</span> {t('List')}
                </h4>
            <h1></h1>
            
                <div
                    className="offcanvas offcanvas-end"
                    id="add-new-record"
                    tabIndex={-1}
                    aria-labelledby="addNewRecordLabel"
                    aria-hidden="true"
                    >
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="addNewRecordLabel">
                             {formMode === 'create' ? t('New Record') : t('Edit Record')}
                        </h5>
                        <button
                            type="button"
                            className="btn-close text-reset"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                            />
                    </div>
                    <div className="offcanvas-body">
                        <UniversityForm
                            mode={formMode}
                            initialData={selectedUniversity}
                            onSubmit={handleFormSubmit}
                            errors={formErrors} 
                            />
                    </div>
                </div>
                
                
                
                <div
                    className="offcanvas offcanvas-end"
                    id="show-details"
                    tabIndex={-1}
                    aria-labelledby="showDetailsLabel"
                    aria-hidden="true"
                >
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="showDetailsLabel">{t('Details')}</h5>
                        <button
                            type="button"
                            className="btn-close text-reset"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        />
                    </div>
                    <div className="offcanvas-body">
                        {viewUniversity ? (
                                
                                
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex align-items-center">

                                    {viewUniversity.name}
                                </li>
                                <li className="list-group-item d-flex align-items-center">

                                    {viewUniversity.description}
                                </li>
                                
                            </ul>
                            
                        ) : (
                            <p>No details available</p>
                        )}
                    </div>
                </div>
                
            
                <div className="card">
            
                    <div className="card-header flex-column flex-md-row">
            
                        <div className="dt-action-buttons text-end pt-3 pt-md-0">
                            <div className="dt-buttons btn-group flex-wrap">
                                {canAdd && 
                                <button
                                    className="btn btn-secondary create-new btn-primary"
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#add-new-record"
                                    aria-controls="add-new-record"
                                    onClick={() => openCreateForm()}
                                    >
                                    <span>
                                        <i className="bx bx-plus me-sm-1" />{" "}
                                        <span className="d-none d-sm-inline-block">{t('Add New Record')}</span>
                                    </span>
                                </button>
                                }
                            </div>
                        </div>
            
                    </div>
            
                    <div className="card-body">
                        {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
                        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            
            
            
                        <div className="table-responsive text-nowrap">
            
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">{t('Name')}</th>
                                        <th scope="col">{t('Description')}</th>
                                        <th scope="col">{t('Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {universities.map((university) => (
                                <tr key={university.id}>
                                    <td>{university.name}</td>
                                    <td>{university.description}</td>
                                    <td>
        
        
                                        {canEdit && 
                                        <button
                                            className="btn btn-warning btn-sm  me-2"
                                            type="button"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#add-new-record"
                                            aria-controls="add-new-record"
                                            onClick={() => openEditForm(university)}
                                            >
        
                                            {t('Edit')}
                                        </button>
                                        }
                                        
                                        {canDetails && 
                                        <button
                                            className="btn btn-success btn-sm  me-2"
                                            type="button"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#show-details"
                                            aria-controls="show-details"
                                            onClick={() => openShowView(university)}
                                            >
        
                                            {t('Details')}
                                        </button>
                                        }
                                        
                                        {canDelete && 
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteUniversity(university.id)}>{t('Delete')}</button>
                                        }
                                    </td>
                                </tr>
                                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            
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

UniversityList.layout = 'default';