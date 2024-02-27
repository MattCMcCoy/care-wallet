import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

import CheckMark from '../assets/checkmark.svg';
import Reject from '../assets/reject.svg';
import { BackButton } from '../components/BackButton';
import { getTaskId, getTaskLabel, getTaskType } from '../services/task';
import { TaskInfo } from '../types/taskInfo';
import { TaskLabel } from '../types/taskLabel';
import { Category, categoryToTypeMap, TypeOfTask } from '../types/type';

export default function SingleTaskScreen({
  setTaskView
}: {
  setTaskView: (bool: boolean) => void;
}) {
  const [taskId] = useState<string>();

  const [open, setOpen] = useState(false);

  const [taskType, setTaskType] = useState<TypeOfTask | undefined>(
    TypeOfTask.MEDICATION_MANAGEMENT
  );

  // Would extract real information in future and not display default, placeholder info
  const [taskInfo, setTaskInfo] = useState({
    created_date: '8:00AM',
    task_id: 1,
    task_info: { title: 'Doctors Appointment' },
    notes:
      'Description here. Description here. Description here. Description here. Description here. Description here. Description here. Description here. Description here. Description here. Description here.'
  });

  const [taskLabel, setTaskLabel] = useState<TaskLabel>();

  useEffect(() => {
    if (taskId) {
      getTaskId(taskId)
        .then((data) => {
          const { created_date, task_id, task_type, notes } = data;
          // Handle cases where task_info and notes might be null or undefined
          const updatedTaskInfo = {
            created_date,
            task_id,
            task_info: { title: '' },
            task_type,
            notes: notes ?? ''
          };
          setTaskInfo(updatedTaskInfo);
        })
        .catch((error) => console.error('Error fetching task info:', error));
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      getTaskLabel(taskId)
        .then((data) => setTaskLabel(data))
        .catch((error) => console.error('Error fetching task label:', error));
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      getTaskType(taskId)
        .then((data) => setTaskType(data))
        .catch((error) => console.error('Error fetching task type:', error));
    }
  }, [taskId]);

  const getCategoryFromTaskType = (
    taskType: TypeOfTask | undefined
  ): Category => {
    console.log(taskType);
    if (!taskType) {
      return Category.ALL; // Return a default category if taskType is undefined
    }
    // Iterate over each category in the categoryToTypeMap object
    for (const category in categoryToTypeMap) {
      // Check if the taskType exists in the current category's array of task types
      if (categoryToTypeMap[category as Category].includes(taskType)) {
        return category as Category; // Return the category if found
      }
    }
    return Category.ALL; // Return a default category if no match is found
  };

  // Gets title from the task_info object
  const getTitleFromTaskInfo = (taskInfo: TaskInfo): string => {
    try {
      if ('title' in taskInfo) {
        return taskInfo.title;
      } else {
        return '';
      }
    } catch (error) {
      console.error('Error parsing task info to extract title:', error);
      return '';
    }
  };

  return (
    <View className="flex flex-col items-start p-4">
      <Pressable
        className="flex-row items-center"
        onTouchEnd={() => setTaskView(false)}
      >
        <BackButton />
      </Pressable>
      <View className="absolute right-0 top-4 m-4">
        <DropDownPicker
          // Very light placeholder for the real dropdown picker. Once backend routes are added
          // to update a task status, then this can be dynamically rendered
          open={open}
          value="value"
          items={[
            { label: 'INCOMPLETE', value: 'incomplete' },
            { label: 'COMPLETE', value: 'Complete' },
            { label: 'PARTIAL', value: 'Partial' }
          ]}
          setOpen={setOpen}
          setValue={setTaskType}
          placeholder="To-do"
          containerStyle={{ height: 40, marginBottom: 8, width: 100 }}
        />
      </View>
      <View className="mt-4">
        <Text className="text-base ">
          {' '}
          {taskLabel?.label_name || 'Label Here'}
        </Text>
      </View>
      <View className="mt-4">
        <Text className="text-base ">
          {getCategoryFromTaskType(taskType) || 'Category Task'} | {taskType}
        </Text>
      </View>
      <View className="mt-4">
        <Text className="text-black font-inter text-2xl font-bold">
          {getTitleFromTaskInfo(taskInfo.task_info) || 'Doctor’s Appointment'}{' '}
          {'\n'} @ {taskInfo.created_date}
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-black font-inter mb-4 text-base font-normal">
          {taskInfo.notes}
        </Text>
        <Text className="text-black font-inter text-xl font-bold">
          Additional Notes{' '}
        </Text>
        <TextInput className="border-black mb-2 h-32 w-80 rounded-lg border-2" />
      </View>

      <View className="ml-auto flex-1 flex-row space-x-4">
        {/* Once backend endpoints for assignining tasks are implemented, then can connect these buttons */}
        <CheckMark />
        <Reject />
      </View>
    </View>
  );
}