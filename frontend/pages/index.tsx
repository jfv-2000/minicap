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
    let stats: { unassignedPatientsCount: Number; pendingCount: Number } = {
        unassignedPatientsCount: NaN,
        pendingCount: NaN,
    };
    let userId = session?.user.AccountId;


    if (role === USER_ROLES.patient) {
        const response = await fetch(serverURL + "/status/getAllStatus/" + userId);
        data = await response.json();
    }

    if (role === USER_ROLES.iOfficer) {
        const response = await fetch(serverURL + "/immigration-officer/countUsersStatus");
        data = await response.json();
    }
    if (role === USER_ROLES.admin) {
        const response = await fetch(serverURL + "/admins/get-dashboard-stats");
        stats = await response.json();
    }

    return {
        props: {
            session,
            data,
            stats,
        },
    };
};

export default function Home({
    data,
    stats,
}: {
    data: unknown[];
    stats: { unassignedPatientsCount: Number; pendingCount: Number };
}) {
    const { data: session } = useSession();
    if (session) {
        return <Dashboard data={data} stats={stats} />;
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
