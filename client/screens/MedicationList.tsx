import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { DocPickerButton } from '../components/DocPickerButton';
import { PopupModal } from '../components/PopupModal';
import { useCareWalletContext } from '../contexts/CareWalletContext';
import { AppStackNavigation } from '../navigation/types';
import { useAuth } from '../services/auth';
import { Medication } from '../types/medication';

export default function MedicationList() {
  const [selectedMed] = useState<Medication>();
  const navigator = useNavigation<AppStackNavigation>();

  const [newMedState, setNewMedState] = useState({ id: '', name: '' });

  const [medVisible, setMedVisible] = useState<boolean>(false);
  const [newMedVisible, setNewMedVisible] = useState<boolean>(false);
  const [userGroupVisible, setUserGroupVisible] = useState<boolean>(false);

  const { user, group } = useCareWalletContext();

  const { signOutMutation } = useAuth();

  return (
    <View className="bg-white w-[100vw] flex-1 items-center justify-center">
      <PopupModal isVisible={medVisible} setVisible={setMedVisible}>
        <Text className="self-center text-3xl">
          {selectedMed?.medication_name}
        </Text>
        <Text className="self-center">ID: {selectedMed?.medication_id}</Text>
      </PopupModal>
      <PopupModal isVisible={newMedVisible} setVisible={setNewMedVisible}>
        <View className="flex flex-row items-center space-x-2 self-center">
          <Text>ID:</Text>
          <TextInput
            className="mb-3 w-[50vw] self-center border border-carewallet-gray text-3xl"
            onChangeText={(val) => setNewMedState({ ...newMedState, id: val })}
            value={newMedState.id}
          />
        </View>
        <View className="flex flex-row items-center space-x-2 self-center">
          <Text>Name:</Text>
          <TextInput
            className="mr-6 w-[50vw] self-center border border-carewallet-gray text-3xl"
            onChangeText={(val) =>
              setNewMedState({ ...newMedState, name: val })
            }
            value={newMedState.name}
          />
        </View>
        <Pressable className="mb-2 ml-2 mt-10 self-center rounded-md border border-carewallet-gray pl-1 pr-1">
          <Text className="self-center text-lg text-carewallet-black">
            Add New Medication
          </Text>
        </Pressable>
      </PopupModal>
      <View className="flex flex-row items-center">
        <DocPickerButton />
        <Pressable
          className="mb-2 ml-2 mt-2 self-center rounded-md border border-carewallet-gray pl-1 pr-1"
          onPress={() => {
            navigator.navigate('TaskType');
          }}
        >
          <Text className="self-center text-lg text-carewallet-black">
            Add New Task
          </Text>
        </Pressable>
      </View>
      <Pressable
        onPress={() => setUserGroupVisible(true)}
        className="mb-2 w-80 self-center rounded-md border border-carewallet-gray "
      >
        <Text className="self-center text-lg text-carewallet-black">
          Show User and Group Info
        </Text>
      </Pressable>
      <PopupModal isVisible={userGroupVisible} setVisible={setUserGroupVisible}>
        <View>
          <Text className="self-start text-lg">User ID: {user.userID}</Text>
          <Text className="self-start text-lg">
            User Email: {user.userEmail}
          </Text>
          <Text className="self-start text-lg">Group ID: {group.groupID}</Text>
          <Text className="self-start text-lg">Group Role: {group.role}</Text>
        </View>
        <Pressable
          onPress={() => {
            setUserGroupVisible(false);
            signOutMutation();
          }}
          className="w-20 self-center rounded-md border border-carewallet-gray"
        >
          <Text className="self-center text-lg text-carewallet-gray">
            Sign Out
          </Text>
        </Pressable>
      </PopupModal>
    </View>
  );
}