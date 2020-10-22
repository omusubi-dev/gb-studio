import React, { FC, useCallback, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormField } from "../../components/library/Forms";
import l10n from "../../lib/helpers/l10n";
import castEventValue from "../../lib/helpers/castEventValue";
import CustomControlsPicker from "../../components/forms/CustomControlsPicker";
import CartPicker from "../../components/forms/CartPicker";
import PaletteSelect from "../../components/forms/PaletteSelect";
import { Button } from "../../components/ui/buttons/Button";
import { SettingsState } from "../../store/features/settings/settingsState";
import settingsActions from "../../store/features/settings/settingsActions";
import navigationActions from "../../store/features/navigation/navigationActions";
import FadeStyleSelect from "../../components/forms/FadeStyleSelect";
import EnginePropsEditor from "../../components/settings/EnginePropsEditor";
import { Checkbox } from "../../components/ui/form/Checkbox";
import { Input } from "../../components/ui/form/Input";
import { RootState } from "../../store/configureStore";
import { useGroupedEngineProps } from "../../components/settings/useGroupedEngineProps";
import { NavigationSection } from "../../store/features/navigation/navigationState";
import { Textarea } from "../../components/ui/form/Textarea";
import useWindowSize from "../../components/ui/hooks/use-window-size";
import {
  SettingsContentColumn,
  SettingsMenuColumn,
  SettingsMenuItem,
  SettingsPageWrapper,
  SettingsSearchWrapper,
} from "../../components/settings/SettingsLayout";
import {
  CardAnchor,
  CardButtons,
  CardHeading,
} from "../../components/ui/cards/Card";
import { SearchableSettingRow } from "../../components/ui/form/SearchableSettingRow";
import {
  SettingRowInput,
  SettingRowLabel,
} from "../../components/ui/form/SettingRow";
import { SearchableCard } from "../../components/ui/cards/SearchableCard";

const SettingsPage: FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state: RootState) => state.project.present.settings
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [scrollToId, setScrollToId] = useState<string>("");
  const groupedFields = useGroupedEngineProps();
  const editSettings = useCallback(
    (patch: Partial<SettingsState>) => {
      dispatch(settingsActions.editSettings(patch));
    },
    [dispatch]
  );
  const setSection = useCallback(
    (section: NavigationSection) => {
      dispatch(navigationActions.setSection(section));
    },
    [dispatch]
  );
  const windowSize = useWindowSize();
  const showMenu = (windowSize.width || 0) >= 750;

  useLayoutEffect(() => {
    if (scrollToId) {
      const el = document.getElementById(scrollToId);
      if (el) {
        el.scrollIntoView();
      }
    }
  }, [scrollToId]);

  const {
    customColorsEnabled,
    customHead,
    defaultUIPaletteId,
    defaultSpritePaletteId,
    defaultBackgroundPaletteIds,
    defaultFadeStyle,
  } = settings;

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  const onMenuItem = (id: string) => () => {
    const el = document.getElementById(id);
    if (el) {
      setScrollToId(id);
    } else {
      setSearchTerm("");
      setScrollToId(id);
    }
  };

  const onEditSetting = (id: string) => (e: any) => {
    editSettings({
      [id]: castEventValue(e),
    });
  };

  const onEditPaletteId = useCallback(
    (index: number, e: any) => {
      const paletteIds = defaultBackgroundPaletteIds
        ? [...defaultBackgroundPaletteIds]
        : [];
      paletteIds[index] = castEventValue(e);
      editSettings({
        defaultBackgroundPaletteIds: [
          paletteIds[0],
          paletteIds[1],
          paletteIds[2],
          paletteIds[3],
          paletteIds[4],
          paletteIds[5],
        ],
      });
    },
    [defaultBackgroundPaletteIds]
  );

  const onResetFadeSettings = () => {
    editSettings({
      defaultFadeStyle: "white",
    });
  };

  return (
    <SettingsPageWrapper>
      {showMenu && (
        <SettingsMenuColumn>
          <SearchableCard>
            <SettingsSearchWrapper>
              <Input
                autoFocus
                type="search"
                placeholder="Search Settings..."
                value={searchTerm}
                onChange={onSearch}
              />
            </SettingsSearchWrapper>
            <SettingsMenuItem onClick={onMenuItem("settingsColor")}>
              {l10n("SETTINGS_GBC")}
            </SettingsMenuItem>
            {groupedFields.map((group) => (
              <SettingsMenuItem
                key={group.name}
                onClick={onMenuItem(`settings${group.name}`)}
              >
                {l10n(group.name)}
              </SettingsMenuItem>
            ))}
            <SettingsMenuItem onClick={onMenuItem("settingsFade")}>
              {l10n("SETTINGS_FADE")}
            </SettingsMenuItem>
            <SettingsMenuItem onClick={onMenuItem("settingsControls")}>
              {l10n("SETTINGS_CONTROLS")}
            </SettingsMenuItem>
            <SettingsMenuItem onClick={onMenuItem("settingsCartType")}>
              {l10n("SETTINGS_CART_TYPE")}
            </SettingsMenuItem>
            <SettingsMenuItem onClick={onMenuItem("settingsCustomHead")}>
              {l10n("SETTINGS_CUSTOM_HEADER")}
            </SettingsMenuItem>
          </SearchableCard>
        </SettingsMenuColumn>
      )}
      <SettingsContentColumn>
        <SearchableCard
          searchTerm={searchTerm}
          searchMatches={[
            l10n("FIELD_EXPORT_IN_COLOR"),
            "Default Background Palettes",
            "Default Sprite Palette",
            "Default UI Palette",
          ]}
        >
          <CardAnchor id="settingsColor" />
          <CardHeading>{l10n("SETTINGS_GBC")}</CardHeading>
          <SearchableSettingRow
            searchTerm={searchTerm}
            searchMatches={[l10n("FIELD_EXPORT_IN_COLOR")]}
          >
            <SettingRowLabel>{l10n("FIELD_EXPORT_IN_COLOR")}</SettingRowLabel>
            <SettingRowInput>
              <Checkbox
                id="customColorsEnabled"
                name="customColorsEnabled"
                checked={customColorsEnabled}
                onChange={onEditSetting("customColorsEnabled")}
              />
            </SettingRowInput>
          </SearchableSettingRow>
          {customColorsEnabled && (
            <>
              <SearchableSettingRow
                searchTerm={searchTerm}
                searchMatches={["Default Background Palettes"]}
              >
                <SettingRowLabel>Default Background Palettes</SettingRowLabel>
                <SettingRowInput>
                  <div key={JSON.stringify(defaultBackgroundPaletteIds)}>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <FormField
                        key={index}
                        style={{
                          padding: 0,
                          paddingBottom: index === 5 ? 0 : 3,
                        }}
                      >
                        <PaletteSelect
                          id="scenePalette"
                          prefix={`${index + 1}: `}
                          value={
                            (defaultBackgroundPaletteIds &&
                              defaultBackgroundPaletteIds[index]) ||
                            ""
                          }
                          onChange={(e: string) => {
                            onEditPaletteId(index, e);
                          }}
                        />
                      </FormField>
                    ))}
                  </div>
                </SettingRowInput>
              </SearchableSettingRow>
              <SearchableSettingRow
                searchTerm={searchTerm}
                searchMatches={["Default Sprite Palette"]}
              >
                <SettingRowLabel>Default Sprite Palette</SettingRowLabel>
                <SettingRowInput>
                  <FormField
                    style={{
                      padding: 0,
                    }}
                  >
                    <PaletteSelect
                      id="scenePalette"
                      value={defaultSpritePaletteId || ""}
                      onChange={onEditSetting("defaultSpritePaletteId")}
                    />
                  </FormField>
                </SettingRowInput>
              </SearchableSettingRow>
              <SearchableSettingRow
                searchTerm={searchTerm}
                searchMatches={["Default UI Palette"]}
              >
                <SettingRowLabel>Default UI Palette</SettingRowLabel>
                <SettingRowInput>
                  <FormField
                    style={{
                      padding: 0,
                    }}
                  >
                    <PaletteSelect
                      id="scenePalette"
                      value={defaultUIPaletteId || ""}
                      onChange={onEditSetting("defaultUIPaletteId")}
                    />
                  </FormField>
                </SettingRowInput>
              </SearchableSettingRow>
              {!searchTerm && (
                <CardButtons>
                  <Button onClick={() => setSection("palettes")}>
                    {l10n("FIELD_EDIT_PALETTES")}
                  </Button>
                </CardButtons>
              )}
            </>
          )}
        </SearchableCard>

        <EnginePropsEditor searchTerm={searchTerm} />

        <SearchableCard
          searchTerm={searchTerm}
          searchMatches={[
            l10n("SETTINGS_FADE"),
            l10n("FIELD_DEFAULT_FADE_STYLE"),
          ]}
        >
          <CardAnchor id="settingsFade" />
          <CardHeading>{l10n("SETTINGS_FADE")}</CardHeading>
          <SearchableSettingRow>
            <SettingRowLabel>
              {l10n("FIELD_DEFAULT_FADE_STYLE")}
            </SettingRowLabel>
            <SettingRowInput>
              <FadeStyleSelect
                value={defaultFadeStyle}
                onChange={onEditSetting("defaultFadeStyle")}
              />
            </SettingRowInput>
          </SearchableSettingRow>
          <CardButtons>
            <Button onClick={onResetFadeSettings}>
              {l10n("FIELD_RESTORE_DEFAULT")}
            </Button>
          </CardButtons>
        </SearchableCard>

        <SearchableCard
          searchTerm={searchTerm}
          searchMatches={[
            "Up",
            "Down",
            "Left",
            "Right",
            "A",
            "B",
            "Start",
            "Select",
          ]}
        >
          <CardAnchor id="settingsControls" />
          <CardHeading>{l10n("SETTINGS_CONTROLS")}</CardHeading>
          <CustomControlsPicker searchTerm={searchTerm} />
        </SearchableCard>

        <SearchableCard
          searchTerm={searchTerm}
          searchMatches={[l10n("SETTINGS_CART_TYPE")]}
        >
          <CardAnchor id="settingsCartType" />
          <CardHeading>{l10n("SETTINGS_CART_TYPE")}</CardHeading>
          <CartPicker searchTerm={searchTerm} />
        </SearchableCard>

        <SearchableCard
          searchTerm={searchTerm}
          searchMatches={["Custom HTML Header"]}
        >
          <CardAnchor id="settingsCustomHead" />
          <CardHeading>{l10n("SETTINGS_CUSTOM_HEADER")}</CardHeading>
          <SearchableSettingRow
            searchTerm={searchTerm}
            searchMatches={["Custom HTML Header"]}
          >
            <SettingRowLabel>Custom HTML Header</SettingRowLabel>
            <SettingRowInput>
              <pre>
                &lt;!DOCTYPE html&gt;{"\n"}
                &lt;html&gt;{"\n  "}
                &lt;head&gt;{"\n  "}
                ...
              </pre>
              <Textarea
                id="customHead"
                value={customHead || ""}
                placeholder={
                  'e.g. <style type"text/css">\nbody {\n  background-color: darkgreen;\n}\n</style>'
                }
                onChange={onEditSetting("customHead")}
                rows={15}
                style={{ fontFamily: "monospace" }}
              />
              <pre>
                {"  "}&lt;/head&gt;{"\n  "}
                &lt;body&gt;{"\n  "}
                ...{"\n  "}
                &lt;body&gt;{"\n"}
                &lt;html&gt;
              </pre>
            </SettingRowInput>
          </SearchableSettingRow>
        </SearchableCard>
      </SettingsContentColumn>
    </SettingsPageWrapper>
  );
};

export default SettingsPage;