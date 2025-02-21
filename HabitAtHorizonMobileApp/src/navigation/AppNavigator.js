import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/user-auth/LoginScreen';
import SignupScreen from '../screens/user-auth/SignUpScreen';
import PasswordResetScreen from '../screens/user-auth/PasswordResetScreen';
import AboutScreen from '../screens/AboutScreen';
import HomeScreen from '../screens/HomeScreen';
import MentorshipScreen from '../screens/mentorsLayout/MentorshipScreen';
import BoardsScreen from '../screens/BoardsScreen';
import BoardDetailsScreen from '../screens/BoardDetailsScreen';
import LessontBuilderScreen from '../screens/LessonBuilderScreen';
import LessonScreen from '../screens/shared-environment-screens/LessonScreen';
import TestCreateScreen from '../screens/TestCreateScreen';
import TestViewScreen from '../screens/shared-environment-screens/TestViewScreen';
import MenteeLessonsActivityScreen from '../screens/MenteeLessonsActivityScreen';
import DetailedSubmissionView from '../screens/DetailedSubmissionView';
import MenteesDashboardScreen from '../screens/mentees/MenteesDashboardScreen';
import MenteeLessonsBoardsScreen from '../screens/mentees/MenteeLessonsBoardsScreen';
import MenteeBoardsList from '../screens/mentees/MenteeBoardsList';
import MenteeCheckedTestScreen from '../screens/mentees/MenteeCheckedTestScreen';
import MenteeTestResultScreen from '../screens/mentees/MenteeTestResultScreen';

//mentee
import MenteeProfileCreationStartScreen from '../screens/self-growth-screens/MenteeProfileCreationStartScreen';
import CreateMenteeProfile from '../screens/self-growth-screens/CreateMenteeScreen'
import MenteeListScreen from '../screens/self-growth-screens/MenteeListScreen'
import MenteeProfileViewScreen from '../screens/self-growth-screens/MenteeProfileViewScreen'


//generals
import ProgressScreen from '../screens/self-growth-screens/ProgressScreen'
import TopListScreen from '../screens/self-growth-screens/TopListScreen'

// Tasks
import PersonalSpaceScreen from '../screens/self-growth-screens/PersonalSpaceScreen';
import TaskListScreen from '../screens/self-growth-screens/tasks-feature/TaskListScreen';
import CreateTaskScreen from '../screens/self-growth-screens/tasks-feature/CreateTaskScreen';
import TaskDetailsScreen from '../screens/self-growth-screens/tasks-feature/TaskDetailsScreen';
// Notes
import NoteListScreen from '../screens/self-growth-screens/notes-feature/NoteListScreen';
import CreateNoteScreen from '../screens/self-growth-screens/notes-feature/CreateNoteScreen';
import NoteViewScreen from '../screens/self-growth-screens/notes-feature/NoteViewScreen';
import EditNoteScreen from '../screens/self-growth-screens/notes-feature/EditNoteScreen';
import ViewTaskScreen from '../screens/self-growth-screens/tasks-feature/ViewTaskScreen';
// Goals
import MainGoalScreen from '../screens/self-growth-screens/goals-feature/MainGoalScreen';
import CreateGoalScreen from '../screens/self-growth-screens/goals-feature/CreateGoalScreen';
import GoalDetailsScreen from '../screens/self-growth-screens/goals-feature/GoalDetailsScreen';
//mentor
import MentorListPage from '../screens/mentorsLayout/MentorListPage'
import AddMentorScreen from '../screens/mentorsLayout/CreateMentorProfileScreen'
import MentorProfileCreationStartScreen from '../screens/mentorsLayout/MentorProfileCreationStartScreen'
import MentorProfileViewScreen from '../screens/mentorsLayout/MentorProfileViewScreen'


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const navigationRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedLoginStatus = await AsyncStorage.getItem('isLoggedIn');
      const user = auth().currentUser;

      if (user || storedLoginStatus === 'true') {
        setIsLoggedIn(true);
        if (isNavigationReady) {
          navigationRef.current?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          );
        }
      } else {
        setIsLoggedIn(false);
        if (isNavigationReady) {
          navigationRef.current?.navigate('Welcome');
        }
      }
    };

    checkLoginStatus();
  }, [isNavigationReady]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        if (isNavigationReady) {
          navigationRef.current?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          );
        }
      } else {
        setIsLoggedIn(false);
        await AsyncStorage.setItem('isLoggedIn', 'false');
        if (isNavigationReady) {
          navigationRef.current?.navigate('Welcome');
        }
      }
    });

    return unsubscribe;
  }, [isNavigationReady]);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setIsNavigationReady(true)}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MentorshipScreen" component={MentorshipScreen} />
            <Stack.Screen
              name="BoardsScreen"
              component={BoardsScreen}
              options={{ headerShown: true, title: 'Boards' }}
            />
            <Stack.Screen
              name="BoardDetailsScreen"
              component={BoardDetailsScreen}
              options={{ headerShown: true, title: 'Board Details' }}
            />
            <Stack.Screen
              name="LessonBuilderScreen"
              component={LessontBuilderScreen}
              options={{ headerShown: true, title: 'Lesson Builder' }}
            />
            <Stack.Screen
              name="LessonScreen"
              component={LessonScreen}
              options={{ headerShown: true, title: 'Lesson Screen' }}
            />
            <Stack.Screen
              name="TestCreateScreen"
              component={TestCreateScreen}
              options={{ headerShown: true, title: 'Test Creation Screen' }}
            />
            <Stack.Screen name="TestViewScreen" component={TestViewScreen} />
            <Stack.Screen
              name="MenteeLessonsActivityScreen"
              component={MenteeLessonsActivityScreen}
              options={{ title: 'Mentee Activity' }}
            />
            <Stack.Screen
              name="DetailedSubmissionView"
              component={DetailedSubmissionView}
              options={{ title: 'Submitted Test' }}
            />
            <Stack.Screen
              name="MenteesDashboardScreen"
              component={MenteesDashboardScreen}
              options={{ title: 'Mentee Dashboard' }}
            />
            <Stack.Screen
              name="MenteeLessonsBoardsScreen"
              component={MenteeLessonsBoardsScreen}
              options={{ title: 'Mentee Lesson' }}
            />
            <Stack.Screen
              name="MenteeBoardsList"
              component={MenteeBoardsList}
              options={{ title: 'Mentee Board List' }}
            />
            <Stack.Screen
              name="MenteeCheckedTestScreen"
              component={MenteeCheckedTestScreen}
              options={{ title: 'Checked Tests' }}
            />
            <Stack.Screen
              name="MenteeTestResultScreen"
              component={MenteeTestResultScreen}
              options={{ title: 'Test Result' }}
            />
            <Stack.Screen
              name="PersonalSpaceScreen"
              component={PersonalSpaceScreen}
              options={{ title: 'Personal Space Screen' }}
            />
            <Stack.Screen
              name="TaskListScreen"
              component={TaskListScreen}
              options={{ title: 'Task List Screen' }}
            />
            <Stack.Screen
              name="CreateTaskScreen"
              component={CreateTaskScreen}
              options={{ title: 'Create Task Screen' }}
            />
            <Stack.Screen
              name="TaskDetailsScreen"
              component={TaskDetailsScreen}
              options={{ title: 'Task Details Screen' }}
            />
            <Stack.Screen
              name="NoteListScreen"
              component={NoteListScreen}
              options={{ title: 'Note List Screen' }}
            />
            <Stack.Screen
              name="CreateNoteScreen"
              component={CreateNoteScreen}
              options={{ title: 'Create Note Screen' }}
            />
            <Stack.Screen
              name="NoteViewScreen"
              component={NoteViewScreen}
              options={{ title: 'Note View Screen' }}
            />
            <Stack.Screen
              name="EditNoteScreen"
              component={EditNoteScreen}
              options={{ title: 'Note Edit Screen' }}
            />
            <Stack.Screen
              name="ViewTaskScreen"
              component={ViewTaskScreen}
              options={{ title: 'View Task Screen' }}
            />
            <Stack.Screen
              name="MainGoalScreen"
              component={MainGoalScreen}
              options={{ title: 'Goals Screen' }}
            />
            <Stack.Screen
              name="CreateGoalScreen"
              component={CreateGoalScreen}
              options={{ title: 'Create Goals Screen' }}
            />
            <Stack.Screen
              name="GoalDetailsScreen"
              component={GoalDetailsScreen}
              options={{ title: 'Goal Details Screen' }}
            />
            <Stack.Screen
              name="MentorListPage"
              component={MentorListPage}
              options={{ title: 'Mentor List' }}
            />
            <Stack.Screen
              name="AddMentorScreen"
              component={AddMentorScreen}
              options={{ title: 'Mentor Screen' }}
            />
            <Stack.Screen
              name="MentorProfileCreationStartScreen"
              component={MentorProfileCreationStartScreen}
              options={{ title: 'Mentor Screen' }}
            />
            <Stack.Screen
              name="MentorProfileViewScreen"
              component={MentorProfileViewScreen}
              options={{ title: 'Mentor Screen' }}
            />
            <Stack.Screen
              name="MenteeProfileCreationStartScreen"
              component={MenteeProfileCreationStartScreen}
              options={{ title: 'Start Screen' }}
            />

            <Stack.Screen
              name="CreateMenteeProfile"
              component={CreateMenteeProfile}
              options={{ title: 'Create Mentee' }}
            />
            <Stack.Screen
              name="MenteeListScreen"
              component={MenteeListScreen}
              options={{ title: 'Mentee List' }}
            />
                        <Stack.Screen
              name="MenteeProfileViewScreen"
              component={MenteeProfileViewScreen}
              options={{ title: 'Mentee Profile' }}
            />
                        <Stack.Screen
              name="ProgressScreen"
              component={ProgressScreen}
              options={{ title: 'Progress Screen' }}
            />
                                    <Stack.Screen
              name="TopListScreen"
              component={TopListScreen}
              options={{ title: 'Top List Screen' }}
            />

          </>
        ) : (

          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignupScreen} />
            <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} />
            <Stack.Screen name="AboutScreen" component={AboutScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;