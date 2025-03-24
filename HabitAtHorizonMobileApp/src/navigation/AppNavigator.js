import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
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
//chat
import ChatScreen from '../screens/chatScreen/ChatScreen'
import UserListScreen from '../screens/chatScreen/UserListScreen'
import NotificationsScreen from '../screens/chatScreen/NotificationsScreen'

//timeline
import CreatePostScreen from '../screens/timeLineScreen/createPostScreen'
import TimelineScreen from '../screens/timeLineScreen/timelineScreen'
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignupScreen} />
    <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} />
    <Stack.Screen name="AboutScreen" component={AboutScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="MentorshipScreen" component={MentorshipScreen} />
    <Stack.Screen name="BoardsScreen" component={BoardsScreen} />
    <Stack.Screen name="BoardDetailsScreen" component={BoardDetailsScreen} />
    <Stack.Screen name="LessonBuilderScreen" component={LessontBuilderScreen} />
    <Stack.Screen name="LessonScreen" component={LessonScreen} />
    <Stack.Screen name="TestCreateScreen" component={TestCreateScreen} />
    <Stack.Screen name="TestViewScreen" component={TestViewScreen} />
    <Stack.Screen name="MenteeLessonsActivityScreen" component={MenteeLessonsActivityScreen} />
    <Stack.Screen name="DetailedSubmissionView" component={DetailedSubmissionView} />
    <Stack.Screen name="MenteesDashboardScreen" component={MenteesDashboardScreen} />
    <Stack.Screen name="MenteeLessonsBoardsScreen" component={MenteeLessonsBoardsScreen} />
    <Stack.Screen name="MenteeBoardsList" component={MenteeBoardsList} />
    <Stack.Screen name="MenteeCheckedTestScreen" component={MenteeCheckedTestScreen} />
    <Stack.Screen name="MenteeTestResultScreen" component={MenteeTestResultScreen} />
    <Stack.Screen name="PersonalSpaceScreen" component={PersonalSpaceScreen} />
    <Stack.Screen name="TaskListScreen" component={TaskListScreen} />
    <Stack.Screen name="CreateTaskScreen" component={CreateTaskScreen} />
    <Stack.Screen name="TaskDetailsScreen" component={TaskDetailsScreen} />
    <Stack.Screen name="NoteListScreen" component={NoteListScreen} />
    <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
    <Stack.Screen name="NoteViewScreen" component={NoteViewScreen} />
    <Stack.Screen name="EditNoteScreen" component={EditNoteScreen} />
    <Stack.Screen name="ViewTaskScreen" component={ViewTaskScreen} />
    <Stack.Screen name="MainGoalScreen" component={MainGoalScreen} />
    <Stack.Screen name="CreateGoalScreen" component={CreateGoalScreen} />
    <Stack.Screen name="GoalDetailsScreen" component={GoalDetailsScreen} />
    <Stack.Screen name="MentorListPage" component={MentorListPage} />
    <Stack.Screen name="AddMentorScreen" component={AddMentorScreen} />
    <Stack.Screen name="MentorProfileCreationStartScreen" component={MentorProfileCreationStartScreen} />
    <Stack.Screen name="MentorProfileViewScreen" component={MentorProfileViewScreen} />
    <Stack.Screen name="MenteeProfileCreationStartScreen" component={MenteeProfileCreationStartScreen} />
    <Stack.Screen name="CreateMenteeProfile" component={CreateMenteeProfile} />
    <Stack.Screen name="MenteeListScreen" component={MenteeListScreen} />
    <Stack.Screen name="MenteeProfileViewScreen" component={MenteeProfileViewScreen} />
    <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
    <Stack.Screen name="TopListScreen" component={TopListScreen} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
    <Stack.Screen name="UserListScreen" component={UserListScreen} />
    <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
    <Stack.Screen name="TimelineScreen" component={TimelineScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const navigationRef = useRef(null);
  const { currentUser, loading } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (!loading && isNavigationReady && navigationRef.current) {
      navigationRef.current.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: currentUser ? 'AppStack' : 'AuthStack' }],
        })
      );
    }
  }, [currentUser, loading, isNavigationReady]);

  if (loading) {
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
        {currentUser ? (
          <Stack.Screen name="AppStack" component={AppStack} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;