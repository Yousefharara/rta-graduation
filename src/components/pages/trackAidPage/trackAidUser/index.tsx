import Container from "@/components/atoms/container";
import { getAids } from "@/redux/slices/aids";
import { getUserAids } from "@/redux/slices/userAids";
import { getUser } from "@/redux/slices/users";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import TrackAidUserHero from "./sections/trackAidUserHero";
import TrackAidUserTableAids from "./sections/trackAidUserTableAids";
import TrackAidUserDescription from "./sections/trackAidUserDescription";

const TrackAidUser = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userAids, isLoading: loadingUserAids } = useAppSelector(
    (state) => state.userAids,
  );
  const { aids, isLoading: loadingAid } = useAppSelector((state) => state.aids);
  const { user: u } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUserAids());
    dispatch(getAids());

    if (user) {
      dispatch(getUser(user));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!loadingUserAids) {
      console.log("user aids , ", userAids, ", aid name, ", aids);
    }
  }, [loadingUserAids, loadingAid, userAids, aids]);

  if (!u) return;

  return (
    <section className="bg-[#F8F9FF] py-20">
      <Container className="flex flex-col gap-8">
        <TrackAidUserHero />
        <TrackAidUserTableAids />
        <TrackAidUserDescription />
      </Container>
      {/* Must be a user
      <p>your name is : {u.name}</p>
      <p>your u is : {u.token}</p>
      <p>your aids is</p>
      {!loadingUserAids && !loadingAid ? (
        <ul>
          {userAids
            .filter((filterUser) => filterUser.user_id == u.id)
            .map((ua) => {
              const currentAid = aids.find((aid) => aid.id == ua.aid_id);

              return (
                <li key={ua.id}>
                  <p>aid : {currentAid?.category}</p>
                  <p>status : {ua.status}</p>
                </li>
              )

            })}
        </ul>
      ) : (
        <h1>Loading ...</h1>
      )} */}
    </section>
  );
};

export default TrackAidUser;
