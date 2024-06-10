// commonImports.js
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getToken } from './auth';
import { executeAjaxOperation } from './fetcher';
import { profileTabOrder } from './tabConfig';
import PrevNextButtons from './PrevNextButtons';
import Select from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import { useTranslation } from 'next-i18next';
import Loader from '../components/Loader';
import CustomAlert  from './CustomAlert'; // Change here

export { React, useRef, useState, useCallback, useEffect, useRouter, axios, getToken, executeAjaxOperation, profileTabOrder, PrevNextButtons, Select, CreatableSelect, useTranslation, Loader, CustomAlert };
