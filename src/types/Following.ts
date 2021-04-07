import { objectType } from "@nexus/schema"

export const Following = objectType({
	name: "Following",
	definition(t) {
		t.model.id()
		t.model.User()
		t.model.UserFollowed()
		t.model.name()
		t.model.avatar()
		t.model.followId()
	}
})
