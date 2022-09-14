export const isFormFieldValid = (name: string, formik: any) => {
    const touched = (formik.touched as Record<string, string>)[name];
    const errors = (formik.errors as Record<string, string>)[name];
    return !!(touched && errors);
};
export const getFormErrorMessage = (
    name: string,
    formik: any,
    showMessage: boolean
) => {
    return (
        <small className="p-error">
            {showMessage && (formik.errors as Record<string, string>)[name]}
        </small>
    );
};
