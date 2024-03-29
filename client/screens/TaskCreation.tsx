import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  GestureHandlerRootView,
  ScrollView
} from 'react-native-gesture-handler';

import { BackButton } from '../components/nav_buttons/BackButton';
import { ForwardButton } from '../components/nav_buttons/ForwardButton.tsx';
import { AddressComponent } from '../components/task_creation/AddressComponent.tsx';
import { RadioGroup } from '../components/task_creation/RadioGroup.tsx';
import { TextInputLine } from '../components/task_creation/TextInputLine.tsx';
import { TextInputParagraph } from '../components/task_creation/TextInputParagraph.tsx';
import { AppStackNavigation } from '../navigation/types.ts';
import { TaskCreationJson } from '../types/task-creation-json.ts';

type ParamList = {
  mt: {
    taskType: string;
  };
};

export function TaskCreation() {
  const navigation = useNavigation<AppStackNavigation>();
  const route = useRoute<RouteProp<ParamList, 'mt'>>();
  const { taskType } = route.params;

  const header = TaskCreationJson.types.find((t) =>
    taskType.includes(t.Header)
  )?.Header;

  const body = TaskCreationJson.types.find((t) =>
    taskType.includes(t.Header)
  )?.Body;

  const compList: { key: string; value: string }[] = [];

  body?.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      compList.push({ key, value });
    });
  });

  const [values, setValues] = useState<{ [key: string]: string }>({});

  const handleChange = (key: string, value: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: value
    }));
  };

  // Function to check if all fields are filled
  const allFieldsFilled = () => {
    return Object.values(values).every((value) => value.trim() !== '');
  };

  // Function to handle forward button click
  const handleForwardButtonClick = () => {
    if (allFieldsFilled()) {
      // Navigate to the AddTaskDetails screen with the necessary parameters
      navigation.navigate('AddTaskDetails', {
        /* any parameters you want to pass */
      });
    } else {
      console.log('Please fill all fields before proceeding.');
    }
  };

  return (
    <GestureHandlerRootView>
      <ScrollView className="mt-10">
        <View className="flex w-full flex-row items-center justify-center">
          <View className="mr-[95px]">
            <BackButton />
          </View>
          <Text className="mr-auto self-center text-center text-carewallet-gray">
            Step 1 of 2
          </Text>
        </View>
        <Text className="text-center text-2xl font-bold">{header}</Text>
        {compList.map((item, index) => (
          <View key={index}>
            {item.key === 'Address' && <AddressComponent />}
            {item.value === 'TextInputLine' && (
              <TextInputLine
                title={item.key}
                onChange={(value) => handleChange(item.key, value)}
              />
            )}
            {item.value === 'TextInputParagraph' && (
              <TextInputParagraph
                title={item.key}
                onChange={(value) => handleChange(item.key, value)}
              />
            )}
            {item.value.startsWith('RadioGroup') && (
              <RadioGroup
                title={item.key}
                options={item.value.substring(12).split(', ')}
                onChange={(value) => handleChange(item.key, value)}
              />
            )}
          </View>
        ))}
        <View className="flex-row justify-end">
          {/* Render ForwardButton component conditionally */}
          {allFieldsFilled() && (
            <ForwardButton onPress={handleForwardButtonClick} />
          )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}