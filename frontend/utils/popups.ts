import { UseToastOptions } from "@chakra-ui/react";

//signin & register popups
const errorPopupBase: UseToastOptions = {
    title: "Error!",
    status: "error",
    isClosable: true,
    position: "top",
};
const successPopupBase: UseToastOptions = {
    title: "Success!",
    status: "success",
    isClosable: true,
    position: "top",
};

const registerDescription = {
    generalError: "There is an error with your sign up attempt. Try again",
    success: "User has been created. Please login.",
    emailError: "There already exists an account with the same email. Please sign in",
    integerError: "The field must be an integer.",
};

const signinErrorDescription = "There was an error in login. Try again";
const patientSymptomsDescription = "There was an error while filling the form. Try again";

export const registerGeneralErrorPopup = { ...errorPopupBase, description: registerDescription.generalError };
export const registerSuccessPopup = { ...successPopupBase, description: registerDescription.success };
export const registerEmailErrorPopup = { ...errorPopupBase, description: registerDescription.emailError };
export const registerIntegerErrorPopup = { ...errorPopupBase, description: registerDescription.integerError };
export const signinErrorPopup = { ...errorPopupBase, description: signinErrorDescription };
export const patientSymptoms = { ...errorPopupBase, description: patientSymptomsDescription };

//health official popups
interface toastInterface {
    firstName: string | undefined;
    lastName: string | undefined;
    covidChange?: boolean;
}

export function successfulToast({ firstName, lastName, covidChange }: toastInterface) {
    return {
        ...successPopupBase,
        description: `${firstName} ${lastName} is now COVID ${covidChange ? "Positive" : "Negative"}`,
        title: "Successful COVID Status Changed",
    };
}

export function unsuccessfulToast({ firstName, lastName }: toastInterface) {
    return {
        ...errorPopupBase,
        description: `Updating ${firstName} ${lastName}'s COVID status has failed`,
        title: "Unsuccessful COVID Status Changed",
    };
}
