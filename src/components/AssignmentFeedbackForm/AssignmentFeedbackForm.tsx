import {
  InputWrapper,
  Slider,
  TextInput,
  Checkbox,
  Text,
  Title,
  Select,
  Group,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import useAssignment from '../../context/AssignmentContext';
import GenericButton from '../generics/GenericButton';

const marks = [
  { value: 0, label: '0' },
  { value: 20, label: '1' },
  { value: 40, label: '2' },
  { value: 60, label: '3' },
  { value: 80, label: '4' },
  { value: 100, label: '5' },
];

const interventions = [
  { value: 'understanding', label: 'Understanding the problem' },
  { value: 'designing', label: 'Designing a solution' },
  { value: 'evaluating', label: 'Evaluating a solution' },
  { value: 'implementing', label: 'Implementing a solution' },
  { value: 'testing', label: 'Evaluating implemented solution' },
];

interface IFormValues {
  easiness: number;
  usefulness: number;
  intervention:
    | 'understanding'
    | 'designing'
    | 'evaluating'
    | 'implementing'
    | 'testing'
    | undefined;
  whatWorkedWell: string;
  whatWentWrong: string;
  useAgain: boolean;
}

const initialValues: IFormValues = {
  easiness: 0,
  usefulness: 0,
  intervention: undefined,
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
    <Stack className='gap-y-8'>
      <Title order={4}>Please rate your experience</Title>
      <Text>
        Please complete this <b>optional</b>, short questionaire. Your answers
        are below the questionaire.
        <br />
        Important: you must submit your answers to coderunner to get your marks
        for this course!
      </Text>
      <form
        onSubmit={form.onSubmit((values) => onSubmit(values))}
        className='flex flex-col gap-y-8'
      >
        <InputWrapper
          className='mb-4'
          label='How easy was it to use this tool?'
          classNames={{ label: 'text-base font-bold' }}
          required
        >
          <Group className='justify-between'>
            <Text size='sm'>Extremely Difficult</Text>
            <Text size='sm'>Extremely Easy</Text>
          </Group>
          <Slider
            label={(val) => marks?.find((mark) => mark.value === val)?.label}
            size='lg'
            step={5}
            marks={marks}
            classNames={{
              bar: 'bg-blue-600',
              markFilled: 'border-blue-600',
              thumb: 'border-blue-600',
              markLabel: 'font-bold text-gray-800',
            }}
            {...form.getInputProps('easiness')}
          />
        </InputWrapper>
        <InputWrapper
          className='mb-4'
          label='How helpful was the problem-solving assistance?'
          classNames={{ label: 'text-base font-bold' }}
          required
        >
          <Group className=' justify-between'>
            <Text size='sm'>Extremely Unhelpful</Text>
            <Text size='sm'>Extremely Helpful</Text>
          </Group>
          <Slider
            label={(val) => marks?.find((mark) => mark.value === val)?.label}
            size='lg'
            step={5}
            marks={marks}
            classNames={{
              bar: 'bg-blue-600',
              markFilled: 'border-blue-600',
              thumb: 'border-blue-600',
              markLabel: 'font-bold text-gray-800',
            }}
            {...form.getInputProps('usefulness')}
          />
        </InputWrapper>
        <Select
          required
          label='Which assistance was the most helpful?'
          size='md'
          classNames={{ input: 'focus:border-blue-600', label: 'font-bold' }}
          placeholder='Pick one'
          data={interventions}
          {...form.getInputProps('intervention')}
        />
        <TextInput
          required
          label='What worked well?'
          size='md'
          classNames={{ input: 'focus:border-blue-600', label: 'font-bold' }}
          placeholder='I found this feature useful. I liked that it was easy to do this.'
          {...form.getInputProps('whatWorkedWell')}
        />
        <TextInput
          required
          label='What went wrong?'
          size='md'
          classNames={{ input: 'focus:border-blue-600', label: 'font-bold' }}
          placeholder='This page was completely broken. I found using this feature frustrating.'
          {...form.getInputProps('whatWentWrong')}
        />
        <Checkbox
          label='I would use this tool again if it was optional'
          size='md'
          classNames={{ input: 'focus:border-blue-600', label: 'font-bold' }}
          {...form.getInputProps('useAgain')}
        />
        <GenericButton type='submit' text='Submit' />
      </form>
    </Stack>
  );
};

export default AssignmentFeedbackForm;
