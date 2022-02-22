import UserLists from "@frontend/components/admin/user-lists";
import { useSession, getSession } from "next-auth/react";
import { USER_ROLES } from "@frontend/utils/constants";
import { NextPageContext } from "next";

export async function getServerSideProps(context: NextPageContext) {
    return {
        props: {
            session: await getSession(context),
        },
    };
}

const UserListPage = () => {
    const { data: session } = useSession();

    if (session?.user.Role === USER_ROLES.admin) {
        return <UserLists sessionId={session.user.AccountId} />;
    }
    return <p>Access Denied</p>;
};

export default UserListPage;
