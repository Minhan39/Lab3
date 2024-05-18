import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import React, {useContext} from 'react';
import {AuthContext} from '../context';

import Home from '../screens/Home';
import Appointment from '../screens/Appointment';
import Customer from '../screens/Customer';
import Setting from '../screens/Setting';

const Tab = createMaterialBottomTabNavigator();

const BottomTab = () => {
  const context = useContext(AuthContext);
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      barStyle={{backgroundColor: '#fff'}}
      activeColor={theme.colors.primary}
      inactiveColor="rgba(1,1,1,0.5)"
      theme={{colors: {secondaryContainer: '#fff'}}}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointment"
        component={Appointment}
        options={{
          tabBarLabel: 'Appointment',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="alarm-check"
              color={color}
              size={26}
            />
          ),
        }}
      />
      {context.user.role === 'admin' && (
        <Tab.Screen
          name="Customer"
          component={Customer}
          options={{
            tabBarLabel: 'Customer',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="account-multiple"
                color={color}
                size={26}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
