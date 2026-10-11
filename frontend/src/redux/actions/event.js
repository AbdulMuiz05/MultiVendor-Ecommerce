import axios from "axios";

export const createEvent = (eventData) => async (dispatch) => {
  try {
    dispatch({
      type: "eventCreateRequest",
    });

    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/event/create-event`,
      eventData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch({
      type: "eventCreateSuccess",
      payload: data.event,
    });

    return data;
  } catch (error) {
    dispatch({
      type: "eventCreateFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getAllEventsShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllEventsShopRequest",
    });

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/event/get-all-events-shop/${shopId}`
    );

    dispatch({
      type: "getAllEventsShopSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAllEventsShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteEventRequest",
    });

    const { data } = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/event/delete-shop-event/${eventId}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteEventSuccess",
      payload: data.message,
    });

    return data;
  } catch (error) {
    dispatch({
      type: "deleteEventFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};