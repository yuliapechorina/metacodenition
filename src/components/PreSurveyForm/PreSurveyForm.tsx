import React from 'react';
import {
  Group,
  InputWrapper,
  Select,
  Slider,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { setUserProperties } from 'firebase/analytics';
import GenericButton from '../generics/GenericButton';
import useUser from '../../hooks/useUser';
import { analytics } from '../../util/firebase';

enum Genders {
  'Female' = 'female',
  'Male' = 'male',
  'Another' = 'another',
  'Prefer not to disclose' = 'notDisclosed',
}

enum Ethnicities {
  'NZ European' = 'nz european',
  'Other European' = 'other european',
  'NZ Maori' = 'nz maori',
  'Samoan' = 'samoan',
  'Cook Island Maori' = 'cook island maori',
  'Tongan' = 'tongan',
  'Niuean' = 'niuean',
  'Tokelauan' = 'tokelauan',
  'Fijian' = 'fijian',
  'Other Pacific Island' = 'other pacific island',
  'South East Asian' = 'south east asian',
  'Chinese' = 'chinese',
  'Indian' = 'indian',
  'Other Asian' = 'other asian',
  'Middle Eastern' = 'middle eastern',
  'Latin American Hispanic' = 'latin american hispanic',
  'African' = 'african',
  'Other Ethnicity' = 'other ethnicity',
}

interface IFormValues {
  gender: Genders | null;
  ethnicity: Ethnicities | null;
  programmingExperience: number;
}

const initialValues: IFormValues = {
  gender: null,
  ethnicity: null,
  programmingExperience: 0,
};

const marks = [
  { value: 0, label: '0' },
  { value: 20, label: '1' },
  { value: 40, label: '2' },
  { value: 60, label: '3' },
  { value: 80, label: '4' },
  { value: 100, label: '5' },
];

const PreSurveyForm = () => {
  const form = useForm({ initialValues });

  const { updateUserDocument, isUserUpdateLoading } = useUser();

  const handleSubmit = (values: IFormValues) => {
    const programmingExperienceLabel = marks?.find(
      (mark) => mark.value === values.programmingExperience
    )?.label;

    updateUserDocument!({
      preSurveySubmitted: true,
      preSurveyAnswers: {
        ...values,
        programmingExperience: programmingExperienceLabel,
      },
    });

    setUserProperties(analytics, {
      user_gender: values.gender,
      ethnicity: values.ethnicity,
      prev_experience: programmingExperienceLabel,
    });
  };

  return (
    <Stack className='gap-y-8 w-1/2'>
      <Title order={4}>
        Please complete this short survey before you begin your assignment
      </Title>
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        className='flex flex-col gap-y-8'
      >
        <Select
          label='What is your gender?'
          classNames={{ label: 'text-base font-bold' }}
          placeholder='Select one'
          data={Array.from(
            (Object.keys(Genders) as Array<keyof typeof Genders>).map(
              (key) => ({
                value: Genders[key],
                label: key,
              })
            )
          )}
          required
          className='w-[300px]'
          {...form.getInputProps('gender')}
        />
        <Select
          label='What is your ethnicity?'
          classNames={{ label: 'text-base font-bold' }}
          placeholder='Select one'
          data={Array.from(
            (Object.keys(Ethnicities) as Array<keyof typeof Ethnicities>).map(
              (key) => ({ value: Ethnicities[key], label: key })
            )
          )}
          searchable
          required
          className='w-[300px]'
          {...form.getInputProps('ethnicity')}
        />
        <InputWrapper
          className='mb-4'
          label='On a scale from 1 to 5, how do you estimate your programming experience?'
          classNames={{ label: 'text-base font-bold' }}
          required
        >
          <Group className=' justify-between'>
            <Text size='sm'>Very inexperienced</Text>
            <Text size='sm'>Very experienced</Text>
          </Group>
          <Slider
            label={(val) => marks?.find((mark) => mark.value === val)?.label}
            size='lg'
            step={20}
            marks={marks}
            classNames={{
              bar: 'bg-blue-600',
              markFilled: 'border-blue-600',
              thumb: 'border-blue-600',
              markLabel: 'font-bold text-gray-800',
            }}
            {...form.getInputProps('programmingExperience')}
          />
        </InputWrapper>
        <GenericButton
          type='submit'
          text='Submit & continue to assignment'
          loading={isUserUpdateLoading}
        />
      </form>
    </Stack>
  );
};

export default PreSurveyForm;
