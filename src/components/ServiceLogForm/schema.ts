import * as yup from 'yup';
import { ServiceType } from '../../features/serviceLogs/types';

export const serviceLogFormSchema = yup.object({
  providerId: yup.string().required('Provider ID is required'),
  serviceOrder: yup.string().required('Service order is required'),
  carId: yup.string().required('Car ID is required'),
  odometer: yup
    .number()
    .min(0, 'Odometer must be 0 or greater')
    .required('Odometer is required'),
  engineHours: yup
    .number()
    .min(0, 'Engine hours must be 0 or greater')
    .required('Engine hours is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup
    .string()
    .required('End date is required')
    .test(
      'is-after-start',
      'End date must be on or after start date',
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return value >= startDate;
      }
    ),
  type: yup
    .string()
    .oneOf(
      [ServiceType.Planned, ServiceType.Unplanned, ServiceType.Emergency],
      'Invalid service type'
    )
    .required('Service type is required'),
  serviceDescription: yup.string().default(''),
});

export type ServiceLogFormValues = yup.InferType<typeof serviceLogFormSchema>;
