import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../app/store';
import { fetchTemplates } from '../../../../features/template/templateSlicer';
