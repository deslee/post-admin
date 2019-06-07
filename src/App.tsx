import React from 'react';
import {
  Admin, Resource, ListGuesser, List, Datagrid,
  ArrayInput, SimpleFormIterator, SelectInput, FormDataConsumer,
  ReferenceField, Edit, TextField, DateField, EditGuesser, SimpleForm, TextInput, DateInput, ReferenceInput
} from 'react-admin';
import dataProvider from './data/dataProvider';

export const PostList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="type" />
      <DateField source="date" />
      <TextField source="data.title" />
      <DateField source="createdBy" />
      <DateField source="updatedBy" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="password" />
    </Datagrid>
  </List>
);

export const PostEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="type" />
      <DateInput source="date" />
      <TextInput source="data.title" />
      <ArrayInput source="data.slices">
        <SimpleFormIterator>
          <SelectInput source="type" choices={[{ "id": "TEXT", "name": "Text" }, { "id": "IMAGES", "name": "Image Carousel" }, { "id": "VIDEO", "name": "Video" }]} />
          <FormDataConsumer>
            {({ formData, scopedFormData, getSource, ...rest }: any) => {
              if (scopedFormData.type === 'TEXT') {
                return <>
                <TextInput source={getSource("text")} />
                </>
              }
              if (scopedFormData.type === 'IMAGES') {
                return <ArrayInput source={getSource("assetIds")}>
                  <SimpleFormIterator>
                    <TextInput />
                  </SimpleFormIterator>
                </ArrayInput>
              }
              if (scopedFormData.type === 'VIDEO') {
                return <ArrayInput source={getSource("assetIds")}>
                  <SimpleFormIterator>
                    <TextInput />
                  </SimpleFormIterator>
                </ArrayInput>
              }
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
      <DateInput source="createdBy" />
      <DateInput source="updatedBy" />
      <DateInput source="createdAt" />
      <DateInput source="updatedAt" />
      <TextInput source="password" />
    </SimpleForm>
  </Edit>
);

const App: React.FC = () => {
  return (
    <div className="App">
      <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} edit={PostEdit} />
      </Admin>
    </div>
  );
}

export default App;
