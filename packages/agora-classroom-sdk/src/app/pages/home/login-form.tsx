import { Field } from '@/app/components/form-field';
import { useHomeStore } from '@/infra/hooks';
import { EduRoleTypeEnum } from 'agora-edu-core';
import { FC, useState } from 'react';
import { Button, Layout, transI18n, useI18n } from '~ui-kit';
import md5 from 'js-md5';
import { useHistory } from 'react-router';
declare const CLASSROOM_SDK_VERSION: string;

const useForm = <T extends Record<string, string>>({
  initialValues,
  validate,
}: {
  initialValues: T | (() => T);
  validate: (
    values: T,
    fieldName: keyof T,
    onError: (field: keyof T, message: string) => void,
  ) => void;
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleValidate = (fieldName: keyof T, temp: typeof errors = {}) =>
    validate(values, fieldName, (fieldName: keyof T, message: string) => {
      temp[fieldName] = message;
    });

  return {
    values,
    errors,
    validate: () => {
      const temp = {};
      Object.keys(values).forEach((fieldName) => {
        handleValidate(fieldName, temp);
      });

      setErrors(temp);

      return !Object.keys(temp).length;
    },
    eventHandlers: (fieldName: keyof T) => ({
      onChange: (value: string) => {
        if (value === '') {
          // const temp = { ...errors };
          // delete temp[fieldName];
          // setErrors(temp);
        }
        setValues({
          ...values,
          [fieldName]: value,
        });
      },
      onBlur: () => {
        const value = values[fieldName];
        if (value === '') {
          // const temp = { ...errors };
          // delete temp[fieldName];
          // setErrors(temp);
        } else {
          const temp = { ...errors };
          delete temp[fieldName];
          handleValidate(fieldName, temp);
          setErrors(temp);
        }
      },
      onKeyUp: () => {
        const temp = { ...errors };
        delete temp[fieldName];
        handleValidate(fieldName, temp);
        setErrors(temp);
      },
    }),
  };
};

export const LoginForm: FC<{
  onSubmit: (values: any) => void;
  sceneOptions: { text: string; value: string }[];
}> = ({ onSubmit, sceneOptions }) => {
  const t = useI18n();
  const history = useHistory();
  const homeStore = useHomeStore();

  const roleOptions = [
    { text: t('home.role_teacher'), value: `${EduRoleTypeEnum.teacher}` },
    { text: t('home.role_student'), value: `${EduRoleTypeEnum.student}` },
    { text: t('home.role_assistant'), value: `${EduRoleTypeEnum.assistant}` },
    { text: t('home.role_audience'), value: `${EduRoleTypeEnum.invisible}` },
  ];

  const classTypeOptions = [
    { text: 'MFWMLO', value: 'MFWMLO' },
    { text: 'SOR', value: 'SOR' },
  ];

  const { values, errors, eventHandlers, validate } = useForm({
    initialValues: () => {
      const queryString = window.location.search;

      const urlParams = new URLSearchParams(queryString);

      const classType = urlParams.get('classType');
      const password = urlParams.get('password') || '';

      const launchConfig = homeStore.launchConfig;
      const { roleType, roomType } = launchConfig;

      return {
        roomName: window.__launchRoomName || (launchConfig.roomName as string) || '',
        userName: '',
        roleType: window.__launchRoleType || `${roleType ?? ''}`,
        roomType: window.__launchRoomType || `${roomType ?? 4}`,
        duration: `${'30'}`,
        classType: window.__launchClassType || `${classType ?? ''}`,
        password: window.__launchMasterPassword || `${password ?? ''}`,
      };
    },
    validate: (values, fieldName, onError) => {
      switch (fieldName) {
        case 'roomName':
          if (!values.roomName) {
            return onError('roomName', transI18n('home_form_placeholder_room_name'));
          }
          if (values.roomName.length < 6 || values.roomName.length > 50) {
            return onError(
              'roomName',
              transI18n('home_form_error_room_name_limit', { min: 6, max: 50 }),
            );
          }
          break;
        case 'userName':
          if (!values.userName) {
            return onError('userName', transI18n('home_form_error_user_name_empty'));
          }
          if (values.userName.length < 3 || values.userName.length > 25) {
            return onError(
              'userName',
              transI18n('home_form_error_user_name_limit', { min: 3, max: 25 }),
            );
          }
          break;
        case 'roleType':
          !values.roleType && onError('roleType', transI18n('home_form_error_role_type_empty'));
          break;
        case 'roomType':
          !values.roomType && onError('roomType', transI18n('home_form_error_room_type_empty'));
          break;
      }
    },
  });

  const { roomName, userName, roleType, duration, classType, password } = values;

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({ ...values, password: md5(password) });
    }
  };

  const [clicked, setClicked] = useState(false);
  const handleReplaceLoginScreenWithStartScreen = () => {
    setClicked(!clicked);
  };

  return clicked ? (
    <div className={'STaccessContainer'}>
      <div className={'STaccess1'}>Studio Access</div>
      <div className={'inputContainer'}>
        <Field
          label={t('home_form_field_room')}
          type="text"
          placeholder={t('home_form_placeholder_room_name')}
          width={160}
          value={roomName}
          {...eventHandlers('roomName')}
          error={errors.roomName}
        />
        {/* </Layout> */}
        {/* <Layout className="mt-6 relative z-20 justify-between"> */}
        <Field
          label={t('home_form_field_name')}
          type="text"
          placeholder={t('home_form_placeholder_user_name')}
          width={160}
          value={userName}
          {...eventHandlers('userName')}
          error={errors.userName}
        />
        <Field
          label={t('home_form_field_role')}
          type="select"
          placeholder={t('home_form_placeholder_user_role')}
          width={160}
          value={roleType}
          options={roleOptions}
          {...eventHandlers('roleType')}
          error={errors.roleType}
        />

        <Field
          label={'Class Type'}
          type="select"
          placeholder={'Class Type'}
          width={160}
          value={classType}
          options={classTypeOptions}
          {...eventHandlers('classType')}
          error={errors.classType}
        />
        <Field
          label={t('home_form_field_duration')}
          type="text"
          placeholder="30mins"
          {...eventHandlers('duration')}
          width={160}
          value={duration}
          error={errors.duration}
        />
        {history.location.pathname !== '/share' ? (
          <Field
            label={'Password'}
            type="text"
            placeholder="Enter Password"
            {...eventHandlers('password')}
            width={160}
            value={password}
            error={errors.password}
          />
        ) : null}

        <button onClick={handleSubmit}>
          <img style={{ cursor: 'pointer', marginTop: '15px' }} src="/assets/loginbtn.png" alt="" />
        </button>
        <div className={'forgotPassword'}>Forgot Password</div>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <div className={'Register'}>Register </div>
          <div className={'Register_sub_text'}>as New User</div>
        </div>
      </div>
    </div>
  ) : (
    <div onClick={handleReplaceLoginScreenWithStartScreen} className={'STaccess'}>
      <div className={'arrow_container'}>
        <div className={'arrow_down'}></div>
      </div>
      <div className={'STaccessText'}>Studio Access</div>
    </div>
  );
  // </form>
};
