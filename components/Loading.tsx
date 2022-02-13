import styles from '../styles/components/LoadSpinner.module.scss';

export const LoadSpinner = () => {
  return (
    <div className={styles.spinner} aria-live='assertive' aria-label='페이지를 로딩 중입니다.'></div>
  );
};