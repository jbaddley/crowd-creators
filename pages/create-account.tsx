import type { NextPage } from "next";
import { FormEvent, useState } from "react";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";

import styles from "../styles/Home.module.css";
import { ClientFetch } from "../lib/clientFetch";

interface Account {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  status?: "INITIAL" | "ERROR" | "SUCCESS";
}
const CreateAccount: NextPage = () => {
  const [user, setUser] = useState<Account>({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    status: "INITIAL",
  });
  return (
    <div>
      <h1>Create an Account</h1>
      <Formik
        initialValues={user}
        onSubmit={async (values, actions) => {
          console.log({ values, actions });
          const response = await ClientFetch.publicPost<Account, Account>(
            "/api/user/create",
            values
          );
          setUser(response);
          actions.setSubmitting(false);
        }}
      >
        <>
          {user.status === "INITIAL" && (
            <Form>
              <label htmlFor="firstName">First Name</label>
              <Field id="firstName" name="firstName" placeholder="First Name" />
              <Field id="lastName" name="lastName" placeholder="Last Name" />
              <Field id="email" name="email" placeholder="Email" type="email" />
              <Field
                id="password"
                name="password"
                placeholder="Password"
                type="password"
              />
              <button type="submit">Submit</button>
            </Form>
          )}
          {user.status === "SUCCESS" && (
            <pre>{JSON.stringify(user, null, 2)}</pre>
          )}
        </>
      </Formik>
    </div>
  );
};

export default CreateAccount;
