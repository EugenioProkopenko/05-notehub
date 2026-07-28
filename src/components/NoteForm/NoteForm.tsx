import * as Yup from 'yup';
import { Field, Formik, Form, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
import type { NewNoteData } from '../../services/noteService';
import { useId } from 'react';
import css from './NoteForm.module.css';

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title is too long')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content is too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

interface NoteFormProps {
  onSubmit: (newNoteData: NewNoteData) => void;
  onClose: () => void;
}

interface NoteFormValue {
  title: string;
  content: string;
  tag: string;
}
const initialValues: NoteFormValue = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({ onSubmit, onClose }: NoteFormProps) {
  const fieldId = useId();
  const handleSubmit = (
    values: NoteFormValue,
    actions: FormikHelpers<NoteFormValue>
  ) => {
    console.log('Order data:', values);
    onSubmit(values);
    actions.resetForm();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={OrderFormSchema}
      >
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`} id="">
              Title
            </label>
            <Field
              id={`${fieldId}-title`}
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-content`}>Content</label>
            <Field
              as="textarea"
              id={`${fieldId}-content`}
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-tag`}>Tag</label>
            <Field
              as="select"
              id={`${fieldId}-tag`}
              name="tag"
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={false}>
              Create note
            </button>
          </div>
        </Form>
      </Formik>
    </>
  );
}
