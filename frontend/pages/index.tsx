import { useSession, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import LoginLogoutButton from "@frontend/components/login-logout-button";
import { Box, Img, Flex, Heading } from "@chakra-ui/react";
import Dashboard from "@frontend/components/homepage/dashboard";

import { serverURL } from "@frontend/config";
import { USER_ROLES } from "@frontend/utils/constants";

export const getServerSideProps: GetServerSideProps = async context => {
    const session = await getSession(context);
    const role = session?.user.Role;
    let data: unknown[] = [];
    let userId = session?.user.AccountId;
    let statusOfTheDay = [];
    const today = new Date().toISOString().slice(0, 10);
    let statusFilled = true;

    if (role === USER_ROLES.patient) {
        let response = await fetch(serverURL + "/status/getAllStatusChart/" + userId);
        data = await response.json();

        // status filled for the day?
        response = await fetch(serverURL + "/status/getAllStatus/" + userId);
        statusOfTheDay = await response.json();

        statusFilled = statusOfTheDay[0].StatusTime.substring(0, 10) === today;

        console.log(statusOfTheDay[0].StatusTime.substring(0, 10));
        console.log(today);
        console.log(statusFilled)
    }

    if (role === USER_ROLES.iOfficer) {
        const response = await fetch(serverURL + "/immigration-officer/countUsersStatus");
        data = await response.json();
    }

    return {
        props: {
            session,
            data,
            statusFilled,
        },
    };
};

export default function Home({ data, statusFilled }: { data: unknown[], statusFilled:boolean }) {
    const { data: session } = useSession();
    if (session) {
        return <Dashboard data={data} statusFilled={statusFilled} />;
    }

    return (
        <Flex
            padding={{ base: "5% 0%", md: "0 10%" }}
            flexDirection={{ base: "column", md: "row" }}
            alignItems="center">
            <Box background="white.100" w={{ base: "100%", md: "50%" }} p={{ base: "15% 10%", md: "20px" }} rounded={6}>
                <Heading mb={8}>Some description</Heading>
                <p>
                    Some more description here lmao badabing badaboom hehe hihi hoho Ideally long enough to take 3-4
                    lines like this So that it looks legit and better lololololololollolollololol
                </p>
                <LoginLogoutButton />
            </Box>

            <Box w="50%" h="100%" p="20px" display={{ base: "none", md: "initial" }}>
                <Img src="https://imgur.com/omMyzrd.png" w="100%" h="100%" alt="Visitor picture" />
            </Box>
        </Flex>
    );
}
