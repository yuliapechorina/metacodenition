import {
  InputWrapper,
  Slider,
  Space,
  TextInput,
  Checkbox,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import useAssignment from '../../context/AssignmentContext';
import GenericButton from '../generics/GenericButton';

const easyMarks = [
  { value: 0, label: 'Extremely Difficult' },
  { value: 25, label: 'Difficult' },
  { value: 50, label: 'Neutral' },
  { value: 75, label: 'Easy' },
  { value: 100, label: 'Extremely Easy' },
];

const usefulMarks = [
  { value: 0, label: 'Extremely Useless' },
  { value: 25, label: 'Useless' },
  { value: 50, label: 'Neutral' },
  { value: 75, label: 'Useful' },
  { value: 100, label: 'Extremely Useful' },
];

interface IFormValues {
  easiness: number;
  usefulness: number;
  whatWorkedWell: string;
  whatWentWrong: string;
  useAgain: boolean;
}

const initialValues: IFormValues = {
  easiness: 0,
  usefulness: 0,
  whatWorkedWell: '',
  whatWentWrong: '',
  useAgain: false,
};

const AssignmentFeedbackForm = () => {
  const { updateUserAssignmentDoc } = useAssignment();

  const form = useForm({
    initialValues,
  });

  const onSubmit = (values: IFormValues) => {
    updateUserAssignmentDoc!({ submitted: true, feedback: values });
  };

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Text>
        Please complete this short questionaire. Once you&apos;re done we will
        let you download your answers so you can submit to coderunner.
        <br />
        Important: you must submit to coderunner to get your marks for this
        course!
      </Text>
      <InputWrapper label='How easy was it to use this tool?' required>
        <Slider
          label={(val) => easyMarks?.find((mark) => mark.value === val)?.label}
          step={5}
          marks={easyMarks}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps('easiness')}
        />
      </InputWrapper>
      <Space h={24} />
      <InputWrapper label='How useful was this tool?' required>
        <Slider
          label={(val) =>
            usefulMarks?.find((mark) => mark.value === val)?.label
          }
          step={5}
          marks={usefulMarks}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps('usefulness')}
        />
      </InputWrapper>
      <Space h={24} />
      <TextInput
        required
        label='What worked well?'
        placeholder='I found this feature useful. I liked that it was easy to do this.'
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('whatWorkedWell')}
      />
      <TextInput
        required
        label='What went wrong?'
        placeholder='This page was completely broken. I found using this feature frustrating.'
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('whatWentWrong')}
      />
      <Space h={24} />
      <Checkbox
        label='I would use this tool again if it was optional'
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('useAgain')}
      />
      <Space h={24} />
      <GenericButton type='submit' text='Submit' />
    </form>
  );
};

export default AssignmentFeedbackForm;
