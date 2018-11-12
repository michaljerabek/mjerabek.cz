import * as Content from "./Content.js";
import * as Navigation from "./Navigation.js";

Content.init();

Navigation.init(
    Content.getOutline()
);
