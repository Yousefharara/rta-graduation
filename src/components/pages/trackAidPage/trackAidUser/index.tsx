import { useAppSelector } from "@/redux/store";

const TrackAidUser = () => {

    const { user } = useAppSelector(state => state.auth)

    return (
        <section>
            Must be a user
            <p>your name is : {user}</p>
        </section>
    );
}

export default TrackAidUser;
