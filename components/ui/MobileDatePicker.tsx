import dynamic from 'next/dynamic';
export default dynamic(() => import('react-mobile-datepicker'), { ssr: false });
